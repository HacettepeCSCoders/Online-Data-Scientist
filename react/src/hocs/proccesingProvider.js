import React, {createContext, useContext, useState} from "react";

const ProcessContext = createContext({});

export const ProcessingProvider = (props) => {
    const [processingDetails, setProcessingDetails] = useState(null);

    return (
        <ProcessContext.Provider
            value={{processingDetails, setProcessingDetails}}
        >
            {props.children}
        </ProcessContext.Provider>
    );
};

export const useProcessing = () => useContext(ProcessContext);
