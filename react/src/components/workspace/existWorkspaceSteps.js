import React, { useEffect, useState } from "react";
import { Button, Layout, Tag, Steps, message, Descriptions } from "antd";
import { useWorkspaceType } from "../../hocs/workspaceTypeProvider";
import { useData } from "../../hocs/dataProvider";
import { useProcessing } from "../../hocs/proccesingProvider";
import { getTable, makeTest, manipulate } from "../../services/processService";
import { existSteps } from "../../utils/workspace/existSteps";
import ResultModal from "./modal/resultModal";
import WaitingModal from "./modal/waitingModal";
import { PageHeader } from "@ant-design/pro-layout";
import ErrorModal from "./modal/errorModal";
import { useNavigate } from "react-router-dom";
const { Content, Sider } = Layout;

const ExistWorkspaceSteps = ({ workspaceId, userId }) => {
  const [current, setCurrent] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState({});
  const { workspaceTypeDetails } = useWorkspaceType();
  const { dataDetails, setDataDetails } = useData();
  const { processingDetails, setProcessingDetails } = useProcessing();
  const [prevMessageApi, prevMessageApiContext] = message.useMessage();
  const [nextMessageApi, nextMessageApiContext] = message.useMessage();
  const [cancelMessageApi, cancelMessageApiContext] = message.useMessage();
  const [isErrorModal, setErrorModal] = useState(false);
  const [isWaitingModalOpen, setIsModalOpen] = useState(false);
  const [isResultModal, setResultModal] = useState(false);
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
          If you go previous page, your changes on this page will be lost. Do
          you want to go previous page?
          <div>
            <Button
              onClick={() => {
                if (current == 2) {
                  setProcessingDetails(undefined);
                }
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
        content: <>Please select the processes you want to do?</>,
        duration: 2,
      });
    }
  };

  const onClickStart = async () => {
    let response;
    try {
      setIsModalOpen(true);

      if (workspaceTypeDetails == "dataManipulation") {
        const body = {
          user_id: userId.toString(),
          workspace_id: workspaceId,
          processes: processingDetails,
        };
        response = await manipulate(JSON.stringify(body));
        const responseGetTable = await getTable(userId, workspaceId);
        setDataDetails(responseGetTable.data);
        console.log(response);
      } else if (workspaceTypeDetails == "statistical") {
        const body = {
          user_id: userId.toString(),
          workspace_id: workspaceId,
          tests: processingDetails,
        };
        console.log(body);
        response = await makeTest(JSON.stringify(body));
        setResult(response.data);
      }
      setIsModalOpen(false);
      setResultModal(true);
    } catch (apiError) {
      console.log("Hata var");
      console.log(apiError);
      setErrorMessage(apiError.response.data.detail);
      setIsModalOpen(false);
      setErrorModal(true);
    }
  };

  const next = () => {
    if (current === 1 && processingDetails == null) {
      nextMessage();
      return;
    } else if (current === 2) {
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
    const getData = async () => {
      try {
        const response = await getTable(userId, workspaceId);
        setDataDetails(response.data);
      } catch (e) {
        console.log();
      }
    };
    getData();
  }, []);

  const items = existSteps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

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
        workspaceTypeDetails={workspaceTypeDetails}
        fileName="a" // fileName Details
        processingDetails={processingDetails}
        result={result}
      />
      <ErrorModal
        isErrorModal={isErrorModal}
        setErrorModal={setErrorModal}
        errorMessage={errorMessage}
      />
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
    </>
  );
};

export default ExistWorkspaceSteps;
