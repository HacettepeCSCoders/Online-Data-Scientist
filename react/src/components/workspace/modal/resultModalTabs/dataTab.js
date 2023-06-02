import React from "react";
import { CSVLink } from "react-csv";
import DataTable from "../../dataTable/dataTable";

const DataTab = ({ dataDetails, fileName }) => {
  return (
    <div>
      <div>
        <DataTable dataDetails={dataDetails}></DataTable>
        <CSVLink filename={fileName + "Updated"} data={dataDetails}>
          Download CSV File
        </CSVLink>
      </div>
    </div>
  );
};

export default DataTab;
