import React, {createContext, useContext, useState} from "react";

const WorkspaceTypeContext = createContext(null);

export const WorkspaceTypeProvider = (props) => {
    const [workspaceTypeDetails, setWorkspaceTypeDetails] = useState(null);

    return (
        <WorkspaceTypeContext.Provider
            value={{workspaceTypeDetails, setWorkspaceTypeDetails}}
        >
            {props.children}
        </WorkspaceTypeContext.Provider>
    );
};

export const useWorkspaceType = () => useContext(WorkspaceTypeContext);
