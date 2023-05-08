import React from "react";
import { Modal, Result } from "antd";

const ErrorModal = ({ setErrorModal, isErrorModal }) => {
  return (
    <>
      <Modal
        open={isErrorModal}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={() => {
          setErrorModal(false);
        }}
        closable={true}
      >
        <Result
          status="warning"
          title="There are some problems with your operation"
          subTitle="Please try again!"
        />
      </Modal>
    </>
  );
};

export default ErrorModal;
