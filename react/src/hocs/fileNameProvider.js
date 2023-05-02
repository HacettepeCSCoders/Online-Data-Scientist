import React, { createContext, useContext, useState } from "react";

const FileNameContext = createContext("");

export const FileNameProvider = (props) => {
  const [fileNameDetails, setFileNameDetails] = useState(null);

  return (
    <FileNameContext.Provider value={{ fileNameDetails, setFileNameDetails }}>
      {props.children}
    </FileNameContext.Provider>
  );
};

export const useFileName = () => useContext(FileNameContext);
