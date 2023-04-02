import React, { createContext, useContext, useState } from "react";

const StepContext = createContext({});

export const StepProvider = (props) => {
  const [stepDetails, setStepDetails] = useState(0);

  return (
    <StepContext.Provider value={{ stepDetails, setStepDetails }}>
      {props.children}
    </StepContext.Provider>
  );
};

export const useStep = () => useContext(StepContext);
