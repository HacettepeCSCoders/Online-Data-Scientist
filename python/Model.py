from enum import Enum
from typing import List

from pydantic import BaseModel
from typing import List


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
    non_num_cols: list = []
    fill_missing_strategy: FillStrategy = FillStrategy.NONE  # Default value


# BaseModel for database connection parameters
class DatabaseConnectionParams(BaseModel):
    username: str
    password: str
    port: int = 5432
    host: str
    database_name: str


# BaseModel for insertion parameters
class InsertionParams(BaseModel):
    processes: Processes
    conflict_resolution_strategy: str = 'replace'  # default value
    user_id: int
    workspace_id: int


# BaseModel for dataframe manipulation parameters
class ManipulationParams(BaseModel):
    processes: Processes
    user_id: int
    workspace_id: int


class StatisticalTest(BaseModel):
    test_name: str
    column_1: str
    column_2: str = ""
    column_3: str = ""


class StatisticalTestList(BaseModel):
    user_id: int
    workspace_id: int
    tests: List[StatisticalTest]
