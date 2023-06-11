import { Modal } from "antd";
import React from "react";
import DataTable from "../dataTable/dataTable";

const DataModal = ({ setDataModal, isDataModal, dataDetails }) => {
  return (
    <>
      <Modal
        open={isDataModal}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={() => {
          setDataModal(false);
        }}
        closable={true}
      >
        <DataTable dataDetails={dataDetails}></DataTable>
      </Modal>
    </>
  );
};
export default DataModal;
