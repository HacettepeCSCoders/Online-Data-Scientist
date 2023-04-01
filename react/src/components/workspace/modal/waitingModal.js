import React from "react";
import { Modal, Result, Spin } from "antd";

const WaitingModal = ({ isWaitingModalOpen }) => {
  return (
    <>
      <Modal
        open={isWaitingModalOpen}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        closable={false}
      >
        <Result
          status="info"
          title="Your processes have started"
          subTitle="Please waiting the results!"
          extra={[<Spin />]}
        />
      </Modal>
    </>
  );
};

export default WaitingModal;
