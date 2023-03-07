import React, {createContext, useContext, useState} from "react";

const DataContext = createContext({});

export const DataProvider = (props) => {
    const [dataDetails, setDataDetails] = useState(null);

    return (
        <DataContext.Provider value={{dataDetails, setDataDetails}}>
            {props.children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
