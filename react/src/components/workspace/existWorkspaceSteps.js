import React, { useEffect, useState } from "react";
import { Button, Layout, Tag, Steps, message, Descriptions } from "antd";
import { useWorkspaceType } from "../../hocs/workspaceTypeProvider";
import { useData } from "../../hocs/dataProvider";
import { useProcessing } from "../../hocs/proccesingProvider";
import { startProcess } from "../../services/processService";
import { existSteps } from "../../utils/workspace/existSteps";
import { useSelector } from "react-redux";
import ResultModal from "./modal/resultModal";
import WaitingModal from "./modal/waitingModal";
import { PageHeader } from "@ant-design/pro-layout";

const { Content, Sider } = Layout;

const ExistWorkspaceSteps = ({ workspaceId, userId }) => {
  const [current, setCurrent] = useState(0);
  const { workspaceTypeDetails } = useWorkspaceType();
  const { dataDetails, setDataDetails } = useData();
  const { processingDetails } = useProcessing();
  const [prevMessageApi, prevMessageApiContext] = message.useMessage();
  const [nextMessageApi, nextMessageApiContext] = message.useMessage();
  const [isWaitingModalOpen, setIsModalOpen] = useState(false);
  const [isResultModal, setResultModal] = useState(false);

  const handleResultCancel = () => {
    setResultModal(false);
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
    if (current === 1) {
      nextMessageApi.open({
        type: "error",
        content: <>Please select which process you want to continue with?</>,
        duration: 2,
      });
    } else if (current === 2) {
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
      const dataAndProcess = {
        userId: userId,
        data: dataDetails,
        processes: processingDetails,
        workspaceId: workspaceId,
      };
      console.log(dataAndProcess);
      const response = await startProcess(dataAndProcess);
      setIsModalOpen(false);
      setResultModal(true);
    } catch {
      console.error();
    }
  };

  const next = () => {
    if (
      (current === 1 && workspaceTypeDetails == null) ||
      (current === 2 && processingDetails == null)
    ) {
      nextMessage();
      return;
    } else if (current === 3) {
      onClickStart();
      return;
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    if (current !== 0) {
      prevMesage();
    }
  };

  useEffect(() => {
    setDataDetails("abc,sa\nas,sa,12");
  }, []);

  const items = existSteps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      {nextMessageApiContext}
      {prevMessageApiContext}
      <Content className="content-nav">
        <div className="div-workspaceSteps">
          <Tag color="#9FB8AD">{workspaceId}</Tag>
          <div>
            {current < existSteps.length - 1 && (
              <Button
                className="dark-background workspace-nextButton"
                onClick={() => next()}
              >
                Next
              </Button>
            )}
            {current === existSteps.length - 1 && (
              <Button
                className="dark-background workspace-nextButton"
                onClick={() => next()}
              >
                Start
              </Button>
            )}
          </div>
        </div>
        <PageHeader
          className="pageHeader-workspace"
          title={existSteps[current].title}
          onBack={prev}
        >
          <Descriptions>
            <Descriptions.Item>
              {existSteps[current].subTitle}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <div>{existSteps[current].content}</div>
      </Content>
      <Sider className="workspace-sider">
        <Steps direction="vertical" current={current} items={items}></Steps>
      </Sider>
      <WaitingModal isWaitingModalOpen={isWaitingModalOpen} />
      <ResultModal
        handleResultCancel={handleResultCancel}
        isResultModal={isResultModal}
        dataDetails={dataDetails}
      />
    </>
  );
};

export default ExistWorkspaceSteps;
