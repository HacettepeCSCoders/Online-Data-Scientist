from enum import Enum
from typing import List

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
    to_drop_columns: List[int] = []
    to_drop_rows: List[int] = []
    non_num_cols: List[str] = []
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
    column_2: str = None
    column_3: str = None


class StatisticalTestList(BaseModel):
    user_id: int
    workspace_id: int
    tests: List[StatisticalTest]

class KnnParams(BaseModel):
    user_id: int
    workspace_id: int
    k: int = 5
    to_learn_columns: List[str]
    target_column: str
    test_size: float = 0.2
    random_state: int = 42
    metric: str = 'minkowski'

class SvmParams(BaseModel):
    user_id: int
    workspace_id: int
    to_learn_columns: List[str]
    target_column: str
    test_size: float = 0.2
    random_state: int = 42
    kernel: str = 'linear'

class KMeansParams(BaseModel):
    user_id: int
    workspace_id: int
    columns: List[str]
    random_state: int = 42
    n_init: int = 1
    n_max: int = 10

class DBScanParams(BaseModel):
    user_id: int
    workspace_id: int
    columns: List[str]
    eps: float = 0.5
    min_samples: int = 5
    metric: str = 'euclidean'
    algorithm: str = 'auto'
    leaf_size: int = 30
    p: int = None
