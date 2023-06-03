import React, { useState } from "react";
import { Button, Layout, Tag, Steps, message, Descriptions } from "antd";
import { steps } from "../../utils/workspace/steps";
import { useWorkspaceType } from "../../hocs/workspaceTypeProvider";
import { useData } from "../../hocs/dataProvider";
import { useProcessing } from "../../hocs/proccesingProvider";
import { useFileName } from "../../hocs/fileNameProvider";
import { startProcess } from "../../services/processService";
import { useSelector } from "react-redux";
import { createWorkspace } from "../../services/workspaceService";
import ResultModal from "./modal/resultModal";
import WaitingModal from "./modal/waitingModal";
import { PageHeader } from "@ant-design/pro-layout";
import ErrorModal from "./modal/errorModal";
import { useDataFiles } from "../../hocs/dataFileProvider";
import { useNavigate } from "react-router-dom";

const { Content, Sider } = Layout;

const WorkspaceSteps = ({ workspaceId, userId }) => {
  const [current, setCurrent] = useState(0);
  const { workspaceTypeDetails } = useWorkspaceType();
  const { dataDetails } = useData();
  const { processingDetails } = useProcessing();
  const { fileNameDetails } = useFileName();
  const { dataFileDetails } = useDataFiles();
  const [prevMessageApi, prevMessageApiContext] = message.useMessage();
  const [cancelMessageApi, cancelMessageApiContext] = message.useMessage();
  const [nextMessageApi, nextMessageApiContext] = message.useMessage();
  const [isWaitingModalOpen, setIsModalOpen] = useState(false);
  const [isResultModal, setResultModal] = useState(false);
  const [isErrorModal, setErrorModal] = useState(false);
  let navigate = useNavigate();

  const handleResultCancel = () => {
    const cancelMessage = () => {
      cancelMessageApi.open({
        type: "info",
        content: (
          <>
            Do you really close result page?
            <div>
              <Button
                onClick={() => {
                  setResultModal(false);
                  navigate("/workspace");
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
    cancelMessage();
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
      setIsModalOpen(true);

      const insertion_params = JSON.stringify({
        user_id: userId,
        data: dataDetails,
        processes: processingDetails,
        workspace_id: workspaceId,
      });

      const formData = new FormData();
      formData.append("file", dataFileDetails);
      formData.append("insertion_params", insertion_params);

      const fileNameAndIds = {
        userId: userId,
        fileName: fileNameDetails,
        id: workspaceId,
      };

      await createWorkspace(fileNameAndIds, userId);
      const response = await startProcess(formData);
      setIsModalOpen(false);
      setResultModal(true);
    } catch (e) {
      console.error(e);
      setIsModalOpen(false);
      setErrorModal(true);
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
    if (current != 0) {
      prevMesage();
    }
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      {nextMessageApiContext}
      {prevMessageApiContext}
      {cancelMessageApiContext}
      <WaitingModal isWaitingModalOpen={isWaitingModalOpen} />
      <ResultModal
        handleResultCancel={handleResultCancel}
        isResultModal={isResultModal}
        dataDetails={dataDetails}
        fileName={fileNameDetails}
        processingDetails={processingDetails}
      />
      <ErrorModal isErrorModal={isErrorModal} setErrorModal={setErrorModal} />
      <Content className="content-nav">
        <div className="div-workspaceSteps">
          <Tag color="#9FB8AD">{workspaceId}</Tag>
          <div>
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
          <PageHeader
            className="pageHeader-workspace"
            title={steps[current].title}
            onBack={prev}
          >
            <Descriptions>
              <Descriptions.Item span={4}>
                {steps[current].subTitle}
              </Descriptions.Item>
              {current === 2 && (
                <Descriptions.Item>
                  <Tag color="#9FB8AD"> {fileNameDetails}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>
          </PageHeader>
        </div>
        <div>{steps[current].content}</div>
      </Content>
      <Sider className="workspace-sider">
        <Steps direction="vertical" current={current} items={items}></Steps>
      </Sider>
    </>
  );
};

export default WorkspaceSteps;
