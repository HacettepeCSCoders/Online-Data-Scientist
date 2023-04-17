import io

import pandas as pd
import sqlalchemy as db
from fastapi import FastAPI, UploadFile, File, Response
from pandas.core.dtypes.common import is_datetime64tz_dtype
from pydantic import Json
from sqlalchemy import INTEGER, FLOAT, TIMESTAMP, BOOLEAN, VARCHAR

import Model

# TODO: db connection params out of parameters each of the endpoints?


# initialize app
app = FastAPI()

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
    # # retrieve manipulation params as dictionary
    # getting_params = manipulation_params.dict()
    # db_user = getting_params['db_connection_params']['username']
    # db_password = getting_params['db_connection_params']['password']
    # db_host = getting_params['db_connection_params']['host']
    # db_port = getting_params['db_connection_params']['port']
    # db_name = getting_params['db_connection_params']['database_name']
    # schema_name = getting_params['schema_name']
    # table_name = getting_params['table_name']
    # to_drop_columns_indices = getting_params['to_drop_columns']
    # to_drop_rows_indices = getting_params['to_drop_rows']
    # fill_missing_strategy = getting_params['fill_missing_strategy']
    #
    # # connect to database
    # con = __connect_to_db__(db_user, db_password, db_host, db_port, db_name)
    # df = __get_table_from_sql__(table_name, schema_name, con)
    # con.close()
    #
    # # manipulate dataframe
    # df = __manipulate_dataframe__(df, to_drop_columns_indices, to_drop_rows_indices, fill_missing_strategy)
    #
    # con = __connect_to_db__(db_user, db_password, db_host, db_port, db_name)
    # __insert__(schema_name, table_name, df, con)
    # con.close()
    #
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

    # get data from request
    data = insertion_params['data']
    to_drop_columns_indices = insertion_params['processes']['to_drop_columns']
    to_drop_rows_indices = insertion_params['processes']['to_drop_rows']
    fill_missing_strategy = insertion_params['processes']['fill_missing_strategy']
    user_id = str(insertion_params['user_id'])
    workspace_id = str(insertion_params['workspace_id'])
    conflict_resolution_strategy = insertion_params['conflict_resolution_strategy']

    # read data and manipulate dataframe
    # df = pd.read_csv(data)
    content = await file.read()
    with io.BytesIO(content) as data:
        if 'csv' in file.content_type:
            df = pd.read_csv(data)
    df = __manipulate_dataframe__(df, to_drop_columns_indices, to_drop_rows_indices, fill_missing_strategy)

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


# function for creating schema if it doesn't exist
def __create_schema_if_not_exists__(con, schema_name):
    if not con.dialect.has_schema(con, schema_name):
        con.execute(db.schema.CreateSchema(schema_name))
        con.commit()

# function for creating table if it doesn't exist
def __create_table_if_not_exists__(con, schema_name, table_name):
    # con.execute(f"CREATE TABLE IF NOT EXISTS {schema_name}.{table_name} (id SERIAL PRIMARY KEY)")
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

# function for validating successful request
def __is_status_code_valid__(status_code):
    if str(status_code).startswith('2'):
        return True
