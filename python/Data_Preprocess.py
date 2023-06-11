import base64
import io

import numpy as np
import pandas as pd
import sqlalchemy as db
import uvicorn
from fastapi import FastAPI, UploadFile, File, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from matplotlib import pyplot as plt
from pandas.core.dtypes.common import is_datetime64tz_dtype
from pydantic import Json
from scipy.stats import shapiro, normaltest, anderson, pearsonr, spearmanr, kendalltau, chi2_contingency, ttest_ind, \
    ttest_rel, f_oneway, mannwhitneyu, wilcoxon, kruskal, friedmanchisquare
from sklearn.cluster import KMeans, DBSCAN
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import OrdinalEncoder, StandardScaler
from sklearn.svm import SVC
from sqlalchemy import INTEGER, FLOAT, TIMESTAMP, BOOLEAN, VARCHAR, text
from statsmodels.tsa.stattools import adfuller, kpss

import Model

# initialize app
app = FastAPI()

origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # origins list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    if df is None or df.empty:
        return "Table not found/empty."

    parsed = df.to_csv(index=False)
    return parsed

@app.delete('/python/delete-user')
async def delete_user(
        response: Response,
        user_id: str
):
    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )
    __delete_user_from_sql__(user_id, con)
    con.close()

    response.status_code = 204

@app.delete('/python/delete-workspace')
async def delete_workspace(
        response: Response,
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
    __delete_workspace_from_sql__(user_id, workspace_id, con)
    con.close()

    response.status_code = 204


##################### -DATA PREPROCESS- #####################

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
    non_num_cols = manipulation_params['processes']['non_num_cols']
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

    # check if given columns are valid
    if to_drop_columns_indices:
        if len(df.columns) < max(to_drop_columns_indices):
            raise HTTPException(status_code=400, detail="Invalid column index.")
    if to_drop_rows_indices:
        if len(df) < max(to_drop_rows_indices):
            raise HTTPException(status_code=400, detail="Invalid row index.")


    # manipulate dataframe
    df: pd.DataFrame = __manipulate_dataframe__(df, to_drop_columns_indices, to_drop_rows_indices,
                                                fill_missing_strategy)

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
    non_num_cols = insertion_params['processes']['non_num_cols']
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

    df: pd.DataFrame = __manipulate_dataframe__(df, to_drop_columns_indices, to_drop_rows_indices,
                                                fill_missing_strategy)

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


##################### -MACHINE LEARNING OPERATIONS- #####################

# Classification

# K Nearest Neighbors (KNN)
@app.post('/python/classification/knn')
async def knn(
        classification_params: Json[Model.KnnParams]
):
    # retrieve classification params as dictionary
    classification_params = classification_params.dict()

    # get data from request
    user_id = str(classification_params['user_id'])
    workspace_id = str(classification_params['workspace_id'])
    target_column = classification_params['target_column']
    to_learn_columns = classification_params['to_learn_columns']
    max_k = classification_params['max_k']
    test_size = classification_params['test_size']
    random_state = classification_params['random_state']
    metric = classification_params['metric']

    if max_k < 2:
        raise HTTPException(status_code=400, detail="Invalid k value.")

    if test_size <= 0 or test_size >= 1:
        raise HTTPException(status_code=400, detail="Invalid test size value.")

    if random_state < 0:
        raise HTTPException(status_code=400, detail="Invalid random state value.")

    if metric not in ['euclidean', 'manhattan', 'chebyshev', 'minkowski']:
        raise HTTPException(status_code=400, detail="Invalid metric value.")

    if len(to_learn_columns) < 2:
        raise HTTPException(status_code=400, detail="Invalid number of columns.")
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
    con.close()

    y_index = df.columns.get_loc(target_column)
    x_df = df.loc[:, to_learn_columns]
    y_df = df.iloc[:, y_index]

    # check if there are any missing values
    if x_df.isnull().values.any() or y_df.isnull().values.any():
        raise HTTPException(status_code=400, detail="There are missing values in the data.")

    x_data = x_df.values
    y_data = y_df.values

    # split data into train and test sets
    x_train, x_test, y_train, y_test = __split_train_test__(x_data, y_data, test_size=test_size,
                                                            random_state=random_state)

    # scale data
    scaler = StandardScaler()
    x_train_knn = scaler.fit_transform(x_train)
    x_test_knn = scaler.transform(x_test)

    # find best k
    best_k = __find_best_k__(x_train_knn, y_train, x_test_knn, y_test, max_k, metric)

    # train model
    classifier = KNeighborsClassifier(n_neighbors=best_k, metric=metric)
    classifier.fit(x_train_knn, y_train)

    # predict test set results
    y_pred = classifier.predict(x_test_knn)

    ret_df = pd.DataFrame(x_test, columns=to_learn_columns)
    ret_df[target_column + '(actual)'] = y_test
    ret_df['predicted'] = y_pred

    # results

    # create confusion matrix
    cm = __create_confusion_matrix__(y_test, y_pred)
    # create classification report
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='macro', zero_division=0)
    recall = recall_score(y_test, y_pred, average='macro', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='macro', zero_division=0)

    plt.figure(figsize=(10, 5))
    scatter = plt.scatter(x_test_knn[:, 0], x_test_knn[:, 1], c=y_pred, marker='*', s=100, edgecolors='black')
    plt.title(f"Predicted values with k={best_k}", fontsize=20)

    # Add colorbar
    colorbar = plt.colorbar(scatter)
    colorbar.set_label("Data Values")

    # Add legend
    handles, labels = scatter.legend_elements()
    legend = plt.legend(handles, labels, loc="upper right")

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)

    return {
        'Best K Value': int(best_k),
        'Confusion Matrix': cm.tolist(),
        'Accuracy': accuracy,
        'Precision': precision,
        'Recall': recall,
        'F1 Score': f1,
        'data': ret_df.to_csv(index=False),
        'plot': base64.b64encode(buf.getvalue()).decode("utf-8")
    }


# Support Vector Machine (SVM)
@app.post('/python/classification/svm')
async def svm(
        svm_params: Json[Model.SvmParams]
):
    # retrieve classification params as dictionary
    svm_params = svm_params.dict()

    # get data from request
    user_id = str(svm_params['user_id'])
    workspace_id = str(svm_params['workspace_id'])
    to_learn_columns = svm_params['to_learn_columns']
    target_column = svm_params['target_column']
    kernel = svm_params['kernel']
    test_size = svm_params['test_size']
    random_state = svm_params['random_state']

    # check kernel value is valid
    if kernel not in ['linear', 'poly', 'rbf', 'sigmoid']:
        raise HTTPException(status_code=400, detail="Invalid kernel value.")

    if random_state < 0:
        raise HTTPException(status_code=400, detail="Invalid random state value.")

    if test_size <= 0 or test_size >= 1:
        raise HTTPException(status_code=400, detail="Invalid test size value.")

    if len(to_learn_columns) < 2:
        raise HTTPException(status_code=400, detail="Invalid number of columns.")


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
    con.close()

    y_index = df.columns.get_loc(target_column)
    x_df = df.loc[:, to_learn_columns]
    y_df = df.iloc[:, y_index]

    # check if there are any missing values
    if x_df.isnull().values.any() or y_df.isnull().values.any():
        raise HTTPException(status_code=400, detail="There are missing values in the data.")

    x_data = x_df.values
    y_data = y_df.values

    # split data into train and test sets
    x_train, x_test, y_train, y_test = __split_train_test__(x_data, y_data, test_size=test_size,
                                                            random_state=random_state)

    # scale data
    scaler = StandardScaler()
    x_train_svm = scaler.fit_transform(x_train)
    x_test_svm = scaler.transform(x_test)

    # train model
    classifier = SVC(kernel=kernel)
    classifier.fit(x_train_svm, y_train)

    # predict test set results
    y_pred = classifier.predict(x_test_svm)

    ret_df = pd.DataFrame(x_test, columns=to_learn_columns)
    ret_df[target_column + '(actual)'] = y_test
    ret_df['predicted'] = y_pred

    # results

    # create confusion matrix
    cm = __create_confusion_matrix__(y_test, y_pred)
    # create classification report
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='macro', zero_division=0)
    recall = recall_score(y_test, y_pred, average='macro', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='macro', zero_division=0)

    # plot results
    plt.figure(figsize=(10, 5))
    scatter = plt.scatter(x_test_svm[:, 0], x_test_svm[:, 1], c=y_pred, marker='*', s=100, edgecolors='black')
    plt.title(f"Predicted values with kernel={kernel}", fontsize=20)

    # Add colorbar
    colorbar = plt.colorbar(scatter)
    colorbar.set_label("Data Values")

    # Add legend
    handles, labels = scatter.legend_elements()
    legend = plt.legend(handles, labels, loc="upper right")

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)

    return {
        'Confusion Matrix': cm.tolist(),
        'Accuracy': accuracy,
        'Precision': precision,
        'Recall': recall,
        'F1 Score': f1,
        'data': ret_df.to_csv(index=False),
        'plot': base64.b64encode(buf.getvalue()).decode("utf-8")
    }

# Clustering

#  K-Means
@app.post('/python/clustering/kmeans')
async def kmeans(
        kmeans_params: Json[Model.KMeansParams]
):
    # retrieve classification params as dictionary
    kmeans_params = kmeans_params.dict()

    # get data from request
    user_id = str(kmeans_params['user_id'])
    workspace_id = str(kmeans_params['workspace_id'])
    columns = kmeans_params['columns']
    target_column = kmeans_params['target_column']
    random_state = kmeans_params['random_state']

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
    con.close()

    x = df.loc[:, columns]

    # check if there are any missing values
    if x.isnull().values.any():
        raise HTTPException(status_code=400, detail="There are missing values in the data.")

    x_data = x.values
    n_clusters = df[target_column].nunique(dropna=True)

    # scale data
    scaler = StandardScaler()
    x_data = scaler.fit_transform(x_data)

    # K-Means algorithm
    kmeans = KMeans(n_clusters=n_clusters, random_state=random_state)
    y_pred = kmeans.fit_predict(x_data)

    ret_df = pd.DataFrame(x_data, columns=columns)
    ret_df[target_column + '(actual)'] = df[target_column]
    ret_df['predicted'] = y_pred

    # plot results
    plt.figure(figsize=(10, 5))
    scatter = plt.scatter(x_data[:, 0], x_data[:, 1], c=y_pred, s=100)
    plt.title(f"Predicted values with n_clusters={n_clusters}", fontsize=20)

    # Add colorbar
    colorbar = plt.colorbar(scatter)
    colorbar.set_label("Data Values")

    # Add legend
    handles, labels = scatter.legend_elements()
    legend = plt.legend(handles, labels, loc="upper right")

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)

    return {
        'data': ret_df.to_csv(index=False),
        'plot': base64.b64encode(buf.getvalue()).decode("utf-8")
    }

# dbscan
@app.post('/python/clustering/dbscan')
async def dbscan(
        dbscan_params: Json[Model.DBScanParams]
):
    # retrieve classification params as dictionary
    dbscan_params = dbscan_params.dict()

    # get data from request
    user_id = str(dbscan_params['user_id'])
    workspace_id = str(dbscan_params['workspace_id'])
    columns = dbscan_params['columns']
    target_column = dbscan_params['target_column']
    eps = dbscan_params['eps']
    min_samples = dbscan_params['min_samples']
    metric = dbscan_params['metric']
    algorithm = dbscan_params['algorithm']
    leaf_size = dbscan_params['leaf_size']
    p = dbscan_params['p']

    # check if algorithm is valid
    if algorithm not in ['auto', 'ball_tree', 'kd_tree', 'brute']:
        raise HTTPException(status_code=400, detail="Invalid algorithm.")

    # check if metric is valid
    if metric not in ['euclidean', 'l1', 'l2', 'manhattan', 'cosine']:
        raise HTTPException(status_code=400, detail="Invalid metric.")


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
    con.close()

    x = df.loc[:, columns]

    # check if there are any missing values
    if x.isnull().values.any():
        raise HTTPException(status_code=400, detail="There are missing values in the data.")

    x_data = x.values

    # scale data
    scaler = StandardScaler()
    x_data = scaler.fit_transform(x_data)

    # DBSCAN algorithm
    dbscan = DBSCAN(eps=eps, min_samples=min_samples, metric=metric, algorithm=algorithm, leaf_size=leaf_size, p=p)
    y_pred = dbscan.fit_predict(x_data)

    ret_df = pd.DataFrame(x_data, columns=columns)
    ret_df[target_column + '(actual)'] = df[target_column]
    ret_df['predicted'] = y_pred

    # plot results
    plt.figure(figsize=(10, 5))
    scatter = plt.scatter(x_data[:, 0], x_data[:, 1], c=y_pred, s=100)
    plt.title(f"Predicted values with eps={eps}", fontsize=20)

    # Add colorbar
    colorbar = plt.colorbar(scatter)
    colorbar.set_label("Data Values")

    # Add legend
    handles, labels = scatter.legend_elements()
    legend = plt.legend(handles, labels, loc="upper right")

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)

    return {
        'data': ret_df.to_csv(index=False),
        'plot': base64.b64encode(buf.getvalue()).decode("utf-8")
    }



##################### -STATISTICAL TESTS- #####################

# Normality tests
def __shapiro_wilk_test__(
        df: pd.DataFrame,
        column_name: str
):
    data = df[column_name].values.tolist()
    stat, p = shapiro(data)
    if p > 0.05:
        return 'SHAPIRO-WILK TEST RESULT: \nProbably Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'SHAPIRO-WILK TEST RESULT: \nProbably not Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


def __dagostino_k2_test__(
        df: pd.DataFrame,
        column_name: str
):
    data = df[column_name].values.tolist()
    stat, p = normaltest(data)
    if p > 0.05:
        return 'D’AGOSTINO’S K^2 TEST RESULT: \nProbably Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'D’AGOSTINO’S K^2 TEST RESULT: \nProbably not Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


def __anderson_darling_test__(
        df: pd.DataFrame,
        column_name: str
):
    data = df[column_name].values.tolist()
    result = anderson(data)
    for i in range(len(result.critical_values)):
        sl, cv = result.significance_level[i], result.critical_values[i]
        if result.statistic < cv:
            return 'ANDERSON-DARLING TEST RESULT: \nProbably Gaussian in column %s at the %.1f%% level' % (
                column_name, sl)
        else:
            return 'ANDERSON-DARLING TEST RESULT: \nProbably not Gaussian in column %s at the %.1f%% level' % (
                column_name, sl)


# Correlation tests
def __pearson_correlation_test__(
        df: pd.DataFrame,
        column_name_1: str,
        column_name_2: str
):
    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = pearsonr(data1, data2)
    if p > 0.05:
        return 'PEARSON`S CORRELATION TEST RESULT: \nProbably independent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'PEARSON`S CORRELATION TEST RESULT: \nProbably dependent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


def __spearmans_rank_correlation_test__(
        df: pd.DataFrame,
        column_name_1: str,
        column_name_2: str
):
    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = spearmanr(data1, data2)
    if p > 0.05:
        return 'SPEARMAN`S RANK CORRELATION TEST RESULT: \nProbably independent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'SPEARMAN`S RANK CORRELATION TEST RESULT: \nProbably dependent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


def __kendalls_rank_correlation_test__(
        df: pd.DataFrame,
        column_name_1: str,
        column_name_2: str
):
    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = kendalltau(data1, data2)
    if p > 0.05:
        return 'KENDALL`S RANK CORRELATION TEST RESULT: \nProbably independent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'KENDALL`S RANK CORRELATION TEST RESULT: \nProbably dependent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


def __chi_squared_correlation_test__(
        df: pd.DataFrame,
        column_name_1: str,
        column_name_2: str
):
    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    all_data = pd.crosstab(data1, data2)
    stat, p, dof, expected = chi2_contingency(all_data)
    if p > 0.05:
        return 'CHI-SQUARED CORRELATION TEST RESULT: \nProbably independent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'CHI-SQUARED CORRELATION TEST RESULT: \nProbably dependent for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


# Stationary Tests

def __augmented_dickey_fuller_stationary_test__(
        df: pd.DataFrame,
        column_name: str
):
    data = df[column_name].values.tolist()
    stat, p, lags, obs, crit, t = adfuller(data)
    if p > 0.05:
        return 'AUGMENTED DICKEY FULLER TEST RESULT: \nProbably Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'AUGMENTED DICKEY FULLER TEST RESULT: \nProbably not Gaussian for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


def __kwiatkowski_stationary_test__(
        df: pd.DataFrame,
        column_name: str
):
    data = df[column_name].values.tolist()
    stat, p, lags, crit = kpss(data)
    if p > 0.05:
        return 'KWIAKOWSKI-PHILLIPS-SCHMIDT-SHIN TEST RESULT: \nProbably not stationary for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'KWIAKOWSKI-PHILLIPS-SCHMIDT-SHIN TEST RESULT: \nProbably stationary for values in column ' + column_name + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


# Parametric Statistical Tests
def __student_t_parametric_test__(
        df: pd.DataFrame,
        column_name_1: str,
        column_name_2: str
):
    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = ttest_ind(data1, data2)
    if p > 0.05:
        return 'STUDENT`S T-TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'STUDENT`S T-TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


def __paired_student_t_parametric_test__(
        df: pd.DataFrame,
        column_name_1: str,
        column_name_2: str
):
    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = ttest_rel(data1, data2)
    if p > 0.05:
        return 'PAIRED STUDENT`S T-TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'PAIRED STUDENT`S T-TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


def __analysis_of_variance_parametric_test__(
        df: pd.DataFrame,
        column_name_1: str,
        column_name_2: str,
        column_name_3: str,
):
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
def __mann_whitney_u_nonparametric_test__(
        df: pd.DataFrame,
        column_name_1: str,
        column_name_2: str
):
    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = mannwhitneyu(data1, data2)
    if p > 0.05:
        return 'MANN-WHITNEY U TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'MANN-WHITNEY U TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


def __wilcoxon_signed_rank_nonparametric_test__(
        df: pd.DataFrame,
        column_name_1: str,
        column_name_2: str
):
    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    result = wilcoxon(data1, data2)
    print(result.pvalue)
    if result.pvalue > 0.05:
        return 'WILCOXON SIGNED-RANK TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            result.statistic, result.pvalue)
    else:
        return 'WILCOXON SIGNED-RANK TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            result.statistic, result.pvalue)


def __kruskal_wallis_nonparametric_test__(
        df: pd.DataFrame,
        column_name_1: str,
        column_name_2: str,
):
    data1 = df[column_name_1].values.tolist()
    data2 = df[column_name_2].values.tolist()
    stat, p = kruskal(data1, data2)
    if p > 0.05:
        return 'KRUSKAL-WALLIS TEST RESULT: \nProbably the same distribution for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)
    else:
        return 'KRUSKAL-WALLIS TEST RESULT: \nProbably different distributions for values in columns ' + column_name_1 + ' and ' + column_name_2 + ' with stat = %.3f, p-value = %.3f' % (
            stat, p)


def __friedman_nonparametric_test__(
        df: pd.DataFrame,
        column_name_1: str,
        column_name_2: str,
        column_name_3: str
):
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


@app.post('/python/make-tests')
def make_tests(
        tests: Json[Model.StatisticalTestList]
):
    tests = tests.dict()
    user_id = str(tests['user_id'])
    workspace_id = str(tests['workspace_id'])
    test_results = {}
    test_list = tests['tests']

    con = __connect_to_db__(
        DB_CONNECTION_PARAMS['db_user'],
        DB_CONNECTION_PARAMS['db_password'],
        DB_CONNECTION_PARAMS['db_host'],
        DB_CONNECTION_PARAMS['db_port'],
        DB_CONNECTION_PARAMS['db_name']
    )

    df = __get_table_from_sql__(workspace_id, user_id, con)
    con.close()

    for test in test_list:
        if test['column_1'] not in df.columns and (test['column_2'] not in df.columns or test['column_2'] is None) \
                and (test['column_3'] not in df.columns or test['column_3'] is None):
            raise HTTPException(status_code=404, detail='Column not found in table')

        if test['test_name'] == 'shapiro_wilk':
            test_results[test['test_name']] = __shapiro_wilk_test__(df, test['column_1'])
        elif test['test_name'] == 'dagostino_k2':
            test_results[test['test_name']] = __dagostino_k2_test__(df, test['column_1'])
        elif test['test_name'] == 'anderson_darling':
            test_results[test['test_name']] = __anderson_darling_test__(df, test['column_1'])
        elif test['test_name'] == 'pearson_correlation':
            test_results[test['test_name']] = __pearson_correlation_test__(df, test['column_1'], test['column_2'])
        elif test['test_name'] == 'spearman_correlation':
            test_results[test['test_name']] = __spearmans_rank_correlation_test__(df, test['column_1'], test['column_2'])
        elif test['test_name'] == 'kendall_correlation':
            test_results[test['test_name']] = __kendalls_rank_correlation_test__(df, test['column_1'], test['column_2'])
        elif test['test_name'] == 'chi_square':
            test_results[test['test_name']] = __chi_squared_correlation_test__(df, test['column_1'], test['column_2'])
        elif test['test_name'] == 'augmented_dickey_fuller':
            test_results[test['test_name']] = __augmented_dickey_fuller_stationary_test__(df, test['column_1'])
        elif test['test_name'] == 'kwiatkowski':
            test_results[test['test_name']] = __kwiatkowski_stationary_test__(df, test['column_1'])
        elif test['test_name'] == 'student_t':
            test_results[test['test_name']] = __student_t_parametric_test__(df, test['column_1'], test['column_2'])
        elif test['test_name'] == 'paired_student_t':
            test_results[test['test_name']] = __paired_student_t_parametric_test__(df, test['column_1'], test['column_2'])
        elif test['test_name'] == 'analysis_of_variance':
            test_results[test['test_name']] = __analysis_of_variance_parametric_test__(df, test['column_1'],
                                                                                       test['column_2'],
                                                                                       test['column_3'])
        elif test['test_name'] == 'mann_whitney_u':
            test_results[test['test_name']] = __mann_whitney_u_nonparametric_test__(df, test['column_1'], test['column_2'])
        elif test['test_name'] == 'wilcoxon_signed_rank':
            test_results[test['test_name']] = __wilcoxon_signed_rank_nonparametric_test__(df, test['column_1'],
                                                                                          test['column_2'])
        elif test['test_name'] == 'kruskal_wallis':
            test_results[test['test_name']] = __kruskal_wallis_nonparametric_test__(df, test['column_1'],
                                                                                    test['column_2'])
        elif test['test_name'] == 'friedman':
            test_results[test['test_name']] = __friedman_nonparametric_test__(df, test['column_1'], test['column_2'],
                                                                              test['column_3'])
        else:
            raise HTTPException(status_code=404, detail='Test undefined')

    return test_results


##################### -PRIVATE FUNCTIONS- #####################

# function for inserting dataframe to database
def __insert__(schema_name, table_name, df, con):
    dtypes = __get_pg_datatypes__(df)
    try:
        df.to_sql(table_name, con=con.engine, schema=schema_name, if_exists='replace', index=False,
                  method='multi', dtype=dtypes)
    except Exception:
        raise HTTPException(status_code=400, detail="Can't insert dataframe to database")


# function for getting table from database
def __get_table_from_sql__(table_name, schema_name, con):
    try:
        df = pd.read_sql_table(table_name=table_name, schema=schema_name, con=con)
    except Exception:
        raise HTTPException(status_code=404, detail="Table could not loaded from database")
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
    try:
        engine = db.create_engine(db_uri)
        con = engine.connect()
    except Exception:
        raise HTTPException(status_code=400, detail="Can't connect to database")
    return con


# function for creating schema if it doesn't exist
def __create_schema_if_not_exists__(con, schema_name):
    if not con.dialect.has_schema(con, schema_name):
        try:
            con.execute(db.schema.CreateSchema(schema_name))
            con.commit()
        except Exception:
            raise HTTPException(status_code=400, detail="Can't create schema")


# function for creating table if it doesn't exist
def __create_table_if_not_exists__(con, schema_name, table_name):
    if not con.dialect.has_table(con, table_name, schema=schema_name):
        try:
            con.execute(db.schema.CreateTable(db.Table(table_name, db.MetaData(), schema=schema_name)))
            con.commit()
        except Exception:
            raise HTTPException(status_code=400, detail="Can't create table")

# function for deleting user from database
def __delete_user_from_sql__(user_id, con):
    try:
        con.execute(text(f"DROP SCHEMA \"{str(user_id)}\" CASCADE;"))
        con.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Can't delete user from database")

# function for deleting table from database
def __delete_workspace_from_sql__(user_id, workspace_id, con):
    try:
        con.execute(text(f"DROP TABLE \"{str(user_id)}\".\"{str(workspace_id)}\" CASCADE;"))
        con.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Can't delete workspace from database")

# manipulate dataframe helper function
def __manipulate_dataframe__(df, to_drop_columns_indices, to_drop_rows_indices, fill_missing_strategy):
    to_drop_columns = [df.columns[i] for i in to_drop_columns_indices]

    # check if there are enough columns and rows for this operation
    if df.columns.size < len(to_drop_columns_indices):
        return "There are not enough columns for this operation."

    if df.index.size < len(to_drop_rows_indices):
        return "There are not enough rows for this operation."

    try:
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
    except Exception:
        raise HTTPException(status_code=400, detail="Can't manipulate dataframe")

    return df


# function for encoding categorical data
def __encode_categorical_data__(df, columns):
    ret_old_non_num = []
    # encoding non-numerical columns
    ord_enc = OrdinalEncoder()
    try:
        for col in columns:
            first = pd.DataFrame(df[col].unique())
            sec = pd.DataFrame(ord_enc.fit_transform(first[[0]]).astype(int))
            first = first.rename(columns={0: 'old_name'})
            sec = sec.rename(columns={0: 'encoded'})
            df[col] = ord_enc.fit_transform(df[[col]]).astype(int)
            ret_old_non_num.append(pd.concat([first, sec], axis=1).sort_values(by=['encoded']).to_dict(orient='records'))
    except Exception:
        raise HTTPException(status_code=400, detail="Can't encode categorical data")
    return df, ret_old_non_num

# function for splitting dataframe to train and test
def __split_train_test__(x_data, y_data, test_size, random_state):
    try:
        X_train, X_test, Y_train, Y_test = train_test_split(x_data, y_data, test_size=test_size, random_state=random_state)
    except Exception:
        raise HTTPException(status_code=400, detail="Can't split dataframe to train and test")
    return X_train, X_test, Y_train, Y_test

# function for creating confusion matrix
def __create_confusion_matrix__(test_data, pred_data):
    try:
        cm = confusion_matrix(test_data, pred_data)
    except Exception:
        raise HTTPException(status_code=400, detail="Can't create confusion matrix")
    return cm

# function for finding best k for kNN
def __find_best_k__(x_train, y_train, x_test, y_test, max_k, metric):
    try:
        k_values = np.arange(1, max_k + 1, 2)
        k_scores = []
        for k in k_values:
            knn = KNeighborsClassifier(n_neighbors=k, metric=metric)
            knn.fit(x_train, y_train)
            y_pred = knn.predict(x_test)
            k_scores.append(accuracy_score(y_test, y_pred))
        best_k = k_values[np.argmax(k_scores)]
    except Exception:
        raise HTTPException(status_code=400, detail="Can't find best k")
    return best_k


# function for validating successful request
def __is_status_code_valid__(status_code):
    if str(status_code).startswith('2'):
        return True


##################### -MAIN FUNCTION- #####################
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
