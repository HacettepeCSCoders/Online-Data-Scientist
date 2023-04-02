import io

import pandas as pd
import sqlalchemy as db
from fastapi import FastAPI, UploadFile, File, Response
from pandas.core.dtypes.common import is_datetime64tz_dtype
from pydantic import Json
from sqlalchemy import INTEGER, FLOAT, TIMESTAMP, BOOLEAN, VARCHAR

import Model

# TODO: userid database creation and validation
# TODO: workspaceid table creation
# TODO: insertion params drop rows columns fill missing
# TODO: db connection params out of parameters each of the endpoints


# initialize app
app = FastAPI()

# Base URL for app
BASE_URL = 'http://localhost:8000'  # url for app comprised of host and port
# headers for request
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/octet-stream'
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


@app.get('/get-table')
def get_table(
        db_user: str,
        db_password: str,
        db_host: str,
        db_port: int,
        db_name: str,
        schema_name: str,
        table_name: str
):
    # retrieve getting params as dictionary
    db_user = db_user
    db_password = db_password
    db_host = db_host
    db_port = db_port
    db_name = db_name
    schema_name = schema_name
    table_name = table_name

    con = __connect_to_db__(db_user, db_password, db_host, db_port, db_name)
    df = __get_table_from_sql__(table_name, schema_name, con)
    con.close()

    if df is None:
        return "Table not found."

    return df.to_json()


@app.post('/manipulate')
def manipulate_table(
        manipulation_params: Json[Model.ManipulationParams]
):
    # retrieve manipulation params as dictionary
    getting_params = manipulation_params.dict()
    db_user = getting_params['db_connection_params']['username']
    db_password = getting_params['db_connection_params']['password']
    db_host = getting_params['db_connection_params']['host']
    db_port = getting_params['db_connection_params']['port']
    db_name = getting_params['db_connection_params']['database_name']
    schema_name = getting_params['schema_name']
    table_name = getting_params['table_name']
    to_drop_columns_indices = getting_params['to_drop_columns']
    to_drop_rows_indices = getting_params['to_drop_rows']
    fill_missing_strategy = getting_params['fill_missing_strategy']

    # connect to database
    con = __connect_to_db__(db_user, db_password, db_host, db_port, db_name)
    df = __get_table_from_sql__(table_name, schema_name, con)
    con.close()

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

    con = __connect_to_db__(db_user, db_password, db_host, db_port, db_name)
    __insert__(schema_name, table_name, df, con)
    con.close()

    return "OK"


# Inserting dataframe to database
@app.post('/insert')
async def insert(
        response: Response,
        insertion_params: Json[Model.InsertionParams],
        file: UploadFile = File(...)
):
    # retrieve insertion params as dictionary
    insertion_params = insertion_params.dict()
    db_user = insertion_params['db_connection_params']['username']
    db_password = insertion_params['db_connection_params']['password']
    db_host = insertion_params['db_connection_params']['host']
    db_port = insertion_params['db_connection_params']['port']
    db_name = insertion_params['db_connection_params']['database_name']
    schema_name = insertion_params['schema_name']
    table_name = insertion_params['table_name']
    conflict_resolution_strategy = insertion_params['conflict_resolution_strategy']
    content = await file.read()

    # read file
    with io.BytesIO(content) as data:
        if 'csv' in file.content_type:
            df = pd.read_csv(data)
        elif 'xlsx' in file.content_type or 'xls' in file.content_type:
            df = pd.read_excel(data)
        else:
            return "Invalid file type."

    # get datatypes
    dtypes = __get_pg_datatypes__(df)
    # connect to db and insert dataframe
    con = __connect_to_db__(db_user, db_password, db_host, db_port, db_name)

    df.to_sql(table_name, con=con.engine, schema=schema_name, if_exists=conflict_resolution_strategy, index=False,
              method='multi', dtype=dtypes)
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
               "Missing values are in the following columns: " + str(df.columns[df.isnull().any()].tolist())

    return "Created table"


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


# function for validating successful request
def __is_status_code_valid__(status_code):
    if str(status_code).startswith('2'):
        return True
