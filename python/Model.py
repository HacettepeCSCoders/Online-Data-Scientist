from enum import Enum

from pydantic import BaseModel


# Enum for fill strategy options
class FillStrategy(Enum):
    NONE = "none"
    MEAN = 'mean'
    MEDIAN = 'median'
    MAX = 'max'
    MIN = 'min'
    ZERO = 'zero'


# BaseModel for database connection parameters
class DatabaseConnectionParams(BaseModel):
    username: str
    password: str
    port: int = 5432
    host: str
    database_name: str


# BaseModel for insertion parameters
class InsertionParams(BaseModel):
    db_connection_params: DatabaseConnectionParams
    schema_name: str
    table_name: str
    conflict_resolution_strategy: str = 'replace'  # default value
    ## TODO add dropRows and dropColumns and fillMissing


# BaseModel for dataframe manipulation parameters
class ManipulationParams(BaseModel):
    db_connection_params: DatabaseConnectionParams
    schema_name: str
    table_name: str
    to_drop_columns: list = []
    to_drop_rows: list = []
    fill_missing_strategy: FillStrategy = FillStrategy.NONE
