import React from "react";
import DataTable from "../../../dataTable/dataTable";
import { CSVLink } from "react-csv";

const PredictTabs = ({ result, workspaceTypeDetails }) => {
  return (
    <>
      <DataTable dataDetails={result.data}> </DataTable>
      <CSVLink filename={"predicted"} data={result.data}>
        Download CSV File
      </CSVLink>
    </>
  );
};

export default PredictTabs;
