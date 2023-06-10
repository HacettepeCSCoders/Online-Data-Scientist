import React from "react";
import { Modal, Result } from "antd";

const ErrorModal = ({ setErrorModal, isErrorModal, errorMessage }) => {
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
          title={`Error occured. Try Again!`}
          subTitle={errorMessage}
        />
      </Modal>
    </>
  );
};

export default ErrorModal;
