import React from "react";

const VisualizeTab = ({ result }) => {
  return (
    <>
      <img alt="saf" src={`data:image/png;base64,${result.plot}`}></img>
    </>
  );
};

export default VisualizeTab;
