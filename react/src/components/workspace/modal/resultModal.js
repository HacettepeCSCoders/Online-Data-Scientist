import React from "react";
import { Modal } from "antd";
import { CSVLink } from "react-csv";
import DataTable from "../dataTable/dataTable";

const ResultModal = ({ handleResultCancel, isResultModal, dataDetails }) => {
  return (
    <>
      <Modal
        className="result-modal"
        open={isResultModal}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={handleResultCancel}
      >
        <div>
          <DataTable dataDetails={dataDetails}></DataTable>
          <CSVLink filename="manipulationData" data={dataDetails}>
            Download CSV File
          </CSVLink>
        </div>
      </Modal>
    </>
  );
};

export default ResultModal;
