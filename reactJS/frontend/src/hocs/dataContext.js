import { createContext } from "react";

const DataContext = createContext({
  rowData: [],
  orFilteredRowData: [],
  setOrFilteredRowData: () => {},
});

export default DataContext;
