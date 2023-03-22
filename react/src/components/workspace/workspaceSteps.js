import React, { useState } from "react";
import { Button, Layout, Tag, Steps, message, Modal, Result, Spin } from "antd";
import { steps } from "../../utils/workspace/steps";
import { useWorkspaceType } from "../../hocs/workspaceTypeProvider";
import { useData } from "../../hocs/dataProvider";
import { useProcessing } from "../../hocs/proccesingProvider";
import { startProcess } from "../../services/processService";
import { useNavigate } from "react-router-dom";

const { Content, Sider } = Layout;

const WorkspaceSteps = () => {
  const [current, setCurrent] = useState(0);
  const { workspaceTypeDetails } = useWorkspaceType();
  const { dataDetails } = useData();
  const { processingDetails } = useProcessing();
  const [prevMessageApi, prevMessageApiContext] = message.useMessage();
  const [nextMessageApi, nextMessageApiContext] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  let navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const prevMesage = () => {
    prevMessageApi.open({
      type: "info",
      content: (
        <>
          If you go prev, your changes on this page will be lost. Do you want to
          go prev?
          <div>
            <Button
              onClick={() => {
                setCurrent(current - 1);
                return;
              }}
            >
              Yes
            </Button>
            <Button>No</Button>
          </div>
        </>
      ),
      duration: 1.25,
    });
  };

  const nextMessage = () => {
    if (current === 0) {
      nextMessageApi.open({
        type: "error",
        content: <>Please select which process you want to continue with?</>,
        duration: 2,
      });
    } else if (current === 1) {
      nextMessageApi.open({
        type: "error",
        content: <>Please upload Excel or CSV file</>,
        duration: 2,
      });
    } else if (current === 3) {
      nextMessageApi.open({
        type: "error",
        content: <>Please select the processes you want to do?</>,
        duration: 2,
      });
    }
  };

  const onClickStart = async () => {
    try {
      showModal();
      const response = await startProcess(processingDetails, dataDetails);
      setTimeout(() => {
        navigate("/", { replace: true }); // must go to result page, component or modal
      }, 10000);
    } catch {
      console.error();
    }
  };

  const next = () => {
    if (
      (current === 0 && workspaceTypeDetails == null) ||
      (current === 1 && dataDetails == null) ||
      (current === 3 && processingDetails == null)
    ) {
      nextMessage();
      return;
    } else if (current === 4) {
      onClickStart();
      return;
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    prevMesage();
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      {nextMessageApiContext}
      {prevMessageApiContext}
      <Content className="content-nav">
        <Tag color="#9FB8AD">workspace2</Tag>
        <div>
          {current > 0 && <Button onClick={() => prev()}>Previous</Button>}
          {current < steps.length - 1 && (
            <Button
              className="dark-background workspace-nextButton"
              onClick={() => next()}
            >
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              className="dark-background workspace-nextButton"
              onClick={() => next()}
            >
              Start
            </Button>
          )}
        </div>
        <div>{steps[current].content}</div>
      </Content>
      <Sider className="workspace-sider">
        <Steps direction="vertical" current={current} items={items}></Steps>
      </Sider>
      <Modal
        open={isModalOpen}
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

export default WorkspaceSteps;
