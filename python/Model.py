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


class Processes(BaseModel):
    to_drop_columns: list = []
    to_drop_rows: list = []
    fill_missing_strategy: FillStrategy = FillStrategy.NONE


# BaseModel for database connection parameters
class DatabaseConnectionParams(BaseModel):
    username: str
    password: str
    port: int = 5432
    host: str
    database_name: str


# BaseModel for insertion parameters
class InsertionParams(BaseModel):
    data: str
    processes: Processes
    conflict_resolution_strategy: str = 'replace'  # default value
    user_id: int
    workspace_id: int


# BaseModel for dataframe manipulation parameters
class ManipulationParams(BaseModel):
    db_connection_params: DatabaseConnectionParams
    schema_name: str
    table_name: str
    to_drop_columns: list = []
    to_drop_rows: list = []
    fill_missing_strategy: FillStrategy = FillStrategy.NONE


