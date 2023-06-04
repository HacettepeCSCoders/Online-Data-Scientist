import io

import pandas as pd
import sqlalchemy as db
from fastapi import FastAPI, UploadFile, File, Response
from pandas.core.dtypes.common import is_datetime64tz_dtype
from pydantic import Json
from sklearn.preprocessing import OrdinalEncoder
from sqlalchemy import INTEGER, FLOAT, TIMESTAMP, BOOLEAN, VARCHAR
from fastapi.middleware.cors import CORSMiddleware

from scipy.stats import shapiro, normaltest, anderson, pearsonr, spearmanr, kendalltau, chi2_contingency, ttest_ind, \
    ttest_rel, f_oneway, mannwhitneyu, wilcoxon, kruskal, friedmanchisquare
from statsmodels.tsa.stattools import adfuller, kpss

import Model


# initialize app
app = FastAPI()

origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Base URL for app
BASE_URL = 'http://localhost:8000'  # url for app comprised of host and port
# headers for request
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/octet-stream'
}

DB_CONNECTION_PARAMS = {
    'db_user': 'postgres',
    'db_password': 'postgres',
    'db_host': 'localhost',
    'db_port': 5432,
    'db_name': 'postgres'
}

# DTYPEs for pandas to sqlalchemy
DTYPE_MAP = {
    'int64': INTEGER,
    'float64': FLOAT,
    'datetime64[ns]': TIMESTAMP,
    'datetime64[ns, UTC]': TIMESTAMP(timezone=True),
    'bool': BOOLEAN,
    'object': VARCHAR
}

##################### -DATA PREPROCESS- #####################

@app.get('/python/get-table')
def get_table(
        user_id: str,
        workspace_id: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    if df is None:
        return "Table not found."
    return df.to_json(orient='records')


@app.post('/python/manipulate')
async def manipulate(
        manipulation_params: Json[Model.ManipulationParams]
):
    # retrieve insertion params as dictionary
    manipulation_params = manipulation_params.dict()

    # get data from request
    to_drop_columns_indices = manipulation_params['processes']['to_drop_columns']
    to_drop_rows_indices = manipulation_params['processes']['to_drop_rows']
    fill_missing_strategy = manipulation_params['processes']['fill_missing_strategy']
    non_num_cols = list(map(int, manipulation_params['processes']['non_num_cols']))
    user_id = str(manipulation_params['user_id'])
    workspace_id = str(manipulation_params['workspace_id'])

    # connect to db
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    # get dataframe from db
    df = __get_table_from_sql__(workspace_id, user_id, con)

    # manipulate dataframe
    df: pd.DataFrame = __manipulate_dataframe__(df, to_drop_columns_indices, to_drop_rows_indices, fill_missing_strategy)

    # encode categorical data
    df, ret_old_non_num = __encode_categorical_data__(df, non_num_cols)
    con.commit()
    # manipulate dataframe
    __insert__(user_id, workspace_id, df, con)
    con.close()

    return ret_old_non_num


# Inserting dataframe to database
@app.post('/python/insert')
async def insert(
        response: Response,
        insertion_params: Json[Model.InsertionParams],
        file: UploadFile = File(...)
):
    # retrieve insertion params as dictionary
    insertion_params = insertion_params.dict()

    # get data from request
    to_drop_columns_indices = insertion_params['processes']['to_drop_columns']
    to_drop_rows_indices = insertion_params['processes']['to_drop_rows']
    fill_missing_strategy = insertion_params['processes']['fill_missing_strategy']
    non_num_cols = list(map(int, insertion_params['processes']['non_num_cols']))
    user_id = str(insertion_params['user_id'])
    workspace_id = str(insertion_params['workspace_id'])
    conflict_resolution_strategy = insertion_params['conflict_resolution_strategy']

    # read data and manipulate dataframe
    content = await file.read()
    with io.BytesIO(content) as data:
        if 'csv' in file.content_type:
            if ord(';') in data.getvalue():
                df = pd.read_csv(data, sep=';')
            else:
                df = pd.read_csv(data, sep=',')
    df: pd.DataFrame = __manipulate_dataframe__(df, to_drop_columns_indices, to_drop_rows_indices, fill_missing_strategy)

    df, ret_old_non_num = __encode_categorical_data__(df, non_num_cols)

    # connect to db
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )

    # create schema and table if it doesn't exist
    con.commit()
    __create_schema_if_not_exists__(con, user_id)
    __create_table_if_not_exists__(con, user_id, workspace_id)

    # manipulate dataframe

    __insert__(user_id, workspace_id, df, con)
    con.close()

    # set response status code
    if conflict_resolution_strategy == 'replace':
        response.status_code = 200
    else:
        response.status_code = 201

    # return response
    if df.empty:
        return "No data was inserted."

    if df.isnull().values.any():
        return "There were missing values in the data. Created table with missing values.<br>" \
               "Missing values are in the following columns: " + str(df.columns[df.isnull().any()].tolist()), \
            ret_old_non_num

    return "Created table", \
        ret_old_non_num

##################### -STATISTICAL TESTS- #####################

# Normality tests
@app.get('/python/normality-test/shapiro-wilk')
def shapiro_wilk_test(
        user_id: str,
        workspace_id: str,
        column_name: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data = df[column_name].values.tolist()
    stat, p = shapiro(data)
    if p > 0.05:
        return 'SHAPIRO-WILK TEST RESULT: \nProbably Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (stat, p)
    else:
        return 'SHAPIRO-WILK TEST RESULT: \nProbably not Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (stat, p)

@app.get('/python/normality-test/dagostino-k2')
def dagostino_k2_test(
        user_id: str,
        workspace_id: str,
        column_name: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data = df[column_name].values.tolist()
    stat, p = normaltest(data)
    if p > 0.05:
        return 'D’AGOSTINO’S K^2 TEST RESULT: \nProbably Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (stat, p)
    else:
        return 'D’AGOSTINO’S K^2 TEST RESULT: \nProbably not Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (stat, p)

@app.get('/python/normality-test/anderson-darling')
def anderson_darling_test(
        user_id: str,
        workspace_id: str,
        column_name: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data = df[column_name].values.tolist()
    result = anderson(data)
    for i in range(len(result.critical_values)):
        sl, cv = result.significance_level[i], result.critical_values[i]
        if result.statistic < cv:
            return 'ANDERSON-DARLING TEST RESULT: \nProbably Gaussian in column %s at the %.1f%% level' % (column_name, sl)
        else:
            return 'ANDERSON-DARLING TEST RESULT: \nProbably not Gaussian in column %s at the %.1f%% level' % (column_name, sl)

# Correlation tests
@app.get('/python/correlation-test/pearson')
def pearson_correlation_test(
        user_id: str,
        workspace_id: str,
        column_name_1: str,
        column_name_2: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = pearsonr(data1, data2)
    if p > 0.05:
        return 'PEARSON`S CORRELATION TEST RESULT: \nProbably independent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (stat, p)
    else:
        return 'PEARSON`S CORRELATION TEST RESULT: \nProbably dependent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (stat, p)

@app.get('/python/correlation-test/spearman')
def spearmans_rank_correlation_test(
        user_id: str,
        workspace_id: str,
        column_name_1: str,
        column_name_2: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = spearmanr(data1, data2)
    if p > 0.05:
        return 'SPEARMAN`S RANK CORRELATION TEST RESULT: \nProbably independent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (stat, p)
    else:
        return 'SPEARMAN`S RANK CORRELATION TEST RESULT: \nProbably dependent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (stat, p)

@app.get('/python/correlation-test/kendall')
def kendalls_rank_correlation_test(
        user_id: str,
        workspace_id: str,
        column_name_1: str,
        column_name_2: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = kendalltau(data1, data2)
    if p > 0.05:
        return 'KENDALL`S RANK CORRELATION TEST RESULT: \nProbably independent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (stat, p)
    else:
        return 'KENDALL`S RANK CORRELATION TEST RESULT: \nProbably dependent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (stat, p)

@app.get('/python/correlation-test/chi-square')
def chi_squared_correlation_test(
        user_id: str,
        workspace_id: str,
        column_name_1: str,
        column_name_2: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    all_data = pd.crosstab(data1, data2)
    stat, p, dof, expected = chi2_contingency(all_data)
    if p > 0.05:
        return 'CHI-SQUARED CORRELATION TEST RESULT: \nProbably independent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (stat, p)
    else:
        return 'CHI-SQUARED CORRELATION TEST RESULT: \nProbably dependent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (stat, p)

# Stationary Tests

@app.get('/python/stationary-test/augmented-dickey-fuller')
def augmented_dickey_fuller_stationary_test(
        user_id: str,
        workspace_id: str,
        column_name: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data = df[column_name].values.tolist()
    stat, p, lags, obs, crit, t = adfuller(data)
    if p > 0.05:
        return 'AUGMENTED DICKEY FULLER TEST RESULT: \nProbably Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)
    else:
        return 'AUGMENTED DICKEY FULLER TEST RESULT: \nProbably not Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)

@app.get('/python/stationary-test/kwiatkowski')
def kwiatkowski_stationary_test(
        user_id: str,
        workspace_id: str,
        column_name: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data = df[column_name].values.tolist()
    stat, p, lags, crit = kpss(data)
    if p > 0.05:
        return 'KWIAKOWSKI-PHILLIPS-SCHMIDT-SHIN TEST RESULT: \nProbably not stationary for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)
    else:
        return 'KWIAKOWSKI-PHILLIPS-SCHMIDT-SHIN TEST RESULT: \nProbably stationary for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)

# Parametric Statistical Tests
@app.get('/python/parametric-test/student-t')
def student_t_parametric_test(
        user_id: str,
        workspace_id: str,
        column_name_1: str,
        column_name_2: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = ttest_ind(data1, data2)
    if p > 0.05:
        return 'STUDENT`S T-TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)
    else:
        return 'STUDENT`S T-TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)

@app.get('/python/parametric-test/paired-student-t')
def paired_student_t_parametric_test(
        user_id: str,
        workspace_id: str,
        column_name_1: str,
        column_name_2: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = ttest_rel(data1, data2)
    if p > 0.05:
        return 'PAIRED STUDENT`S T-TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)
    else:
        return 'PAIRED STUDENT`S T-TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)

@app.get('/python/parametric-test/analysis-of-variance')
def analysis_of_variance_parametric_test(
        user_id: str,
        workspace_id: str,
        column_name_1: str,
        column_name_2: str,
        column_name_3: str,
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    data3 = df[column_name_3].values.tolist()
    stat, p = f_oneway(data1, data2, data3)
    if p > 0.05:
        return 'ANALYSIS OF VARIANCE TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ', ' + column_name_2 + ' and ' + column_name_3 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)
    else:
        return 'ANALYSIS OF VARIANCE TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ', ' + column_name_2 + ' and ' + column_name_3 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)

# Nonparametric Statistical Hypothesis Tests
@app.get('/python/nonparametric-test/mann-whitney-u')
def mann_whitney_u_nonparametric_test(
        user_id: str,
        workspace_id: str,
        column_name_1: str,
        column_name_2: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = mannwhitneyu(data1, data2)
    if p > 0.05:
        return 'MANN-WHITNEY U TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)
    else:
        return 'MANN-WHITNEY U TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)

@app.get('/python/nonparametric-test/wilcoxon-signed-rank')
def wilcoxon_signed_rank_nonparametric_test(
        user_id: str,
        workspace_id: str,
        column_name_1: str,
        column_name_2: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = wilcoxon(data1, data2)
    if p > 0.05:
        return 'WILCOXON SIGNED-RANK TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)
    else:
        return 'WILCOXON SIGNED-RANK TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)

@app.get('/python/nonparametric-test/kruskal-wallis')
def kruskal_wallis_nonparametric_test(
        user_id: str,
        workspace_id: str,
        column_name_1: str,
        column_name_2: str,
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = kruskal(data1, data2)
    if p > 0.05:
        return 'KRUSKAL-WALLIS TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)
    else:
        return 'KRUSKAL-WALLIS TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)

@app.get('/python/nonparametric-test/friedman')
def friedman_nonparametric_test(
        user_id: str,
        workspace_id: str,
        column_name_1: str,
        column_name_2: str,
        column_name_3: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    data3 = df[column_name_3].values.tolist()
    stat, p = friedmanchisquare(data1, data2, data3)
    if p > 0.05:
        return 'FRIEDMAN CHI-SQUARE TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ', ' + column_name_2 + ' and ' + column_name_3 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)
    else:
        return 'FRIEDMAN CHI-SQUARE TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ', ' + column_name_2 + ' and ' + column_name_3 + ' with stat = %.3f, p-value = %.3f' % (
        stat, p)


##################### -PRIVATE FUNCTIONS- #####################

# function for inserting dataframe to database
def __insert__(schema_name, table_name, df, con):
    dtypes = __get_pg_datatypes__(df)
    df.to_sql(table_name, con=con.engine, schema=schema_name, if_exists='replace', index=False,
              method='multi', dtype=dtypes)


# function for getting table from database
def __get_table_from_sql__(table_name, schema_name, con):
    df = pd.read_sql_table(table_name=table_name, schema=schema_name, con=con)
    return df


# function for getting postgresql datatypes
def __get_pg_datatypes__(df):
    dtypes = {}
    for col, dtype in df.dtypes.items():
        if is_datetime64tz_dtype(dtype):
            dtypes[col] = DTYPE_MAP['datetime64[ns, UTC]']
        else:
            dtypes[col] = DTYPE_MAP[str(dtype)]
    return dtypes


# function for connecting to database
def __connect_to_db__(user, password, host, port, name):
    db_uri = f'postgresql://{user}:{password}@{host}:{port}/{name}'
    engine = db.create_engine(db_uri)
    con = engine.connect()
    return con


# function for creating schema if it doesn't exist
def __create_schema_if_not_exists__(con, schema_name):
    if not con.dialect.has_schema(con, schema_name):
        con.execute(db.schema.CreateSchema(schema_name))
        con.commit()

# function for creating table if it doesn't exist
def __create_table_if_not_exists__(con, schema_name, table_name):
    if not con.dialect.has_table(con, table_name, schema=schema_name):
        con.execute(db.schema.CreateTable(db.Table(table_name, db.MetaData(), schema=schema_name)))
        con.commit()

# manipulate dataframe helper function
def __manipulate_dataframe__(df, to_drop_columns_indices, to_drop_rows_indices, fill_missing_strategy):
    to_drop_columns = [df.columns[i] for i in to_drop_columns_indices]

    # check if there are enough columns and rows for this operation
    if df.columns.size < len(to_drop_columns_indices):
        return "There are not enough columns for this operation."

    if df.index.size < len(to_drop_rows_indices):
        return "There are not enough rows for this operation."

    # fill missing values according to strategy
    if fill_missing_strategy == Model.FillStrategy.MEAN:
        df = df.fillna(df.mean())
    elif fill_missing_strategy == Model.FillStrategy.MEDIAN:
        df = df.fillna(df.median())
    elif fill_missing_strategy == Model.FillStrategy.MAX:
        df = df.fillna(df.max())
    elif fill_missing_strategy == Model.FillStrategy.MIN:
        df = df.fillna(df.min())
    elif fill_missing_strategy == Model.FillStrategy.ZERO:
        df = df.fillna(0)
    elif fill_missing_strategy == Model.FillStrategy.NONE:
        pass
    else:
        return "Invalid fill missing strategy."

    df = df.drop(axis=0, labels=to_drop_rows_indices)
    df = df.drop(axis=1, columns=to_drop_columns)

    return df

# function for encoding categorical data
def __encode_categorical_data__(df, columns):
    ret_old_non_num = []
    # encoding non-numerical columns
    ord_enc = OrdinalEncoder()
    for col in columns:
        first = pd.DataFrame(df[df.columns[col]].unique())
        sec = pd.DataFrame(ord_enc.fit_transform(first[[0]]).astype(int))
        first = first.rename(columns={0: 'old_name'})
        sec = sec.rename(columns={0: 'encoded'})
        df[df.columns[col]] = ord_enc.fit_transform(df[[df.columns[col]]]).astype(int)
        ret_old_non_num.append(pd.concat([first, sec], axis=1).sort_values(by=['encoded']).to_dict(orient='records'))
    return df, ret_old_non_num

# function for validating successful request
def __is_status_code_valid__(status_code):
    if str(status_code).startswith('2'):
        return True
