import React from "react";
import { useData } from "../../hocs/dataProvider";
import { Table } from "antd";

const VisualizeData = () => {
  const { dataDetails, setDataDetails } = useData();
  return (
    <>
      <div> {dataDetails}</div>
    </>
  );
};
export default VisualizeData;
