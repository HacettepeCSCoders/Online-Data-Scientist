import React, { createContext, useContext, useState } from "react";

const DataFileContext = createContext();

export const DataFileProvider = (props) => {
  const [dataFileDetails, setDataFileDetails] = useState();

  const storeFileData = (data) => {
    setDataFileDetails(data);
  };

  return (
    <DataFileContext.Provider value={{ dataFileDetails, storeFileData }}>
      {props.children}
    </DataFileContext.Provider>
  );
};

export const useDataFiles = () => useContext(DataFileContext);
