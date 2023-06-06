import React from "react";
import { Modal, Tabs } from "antd";
import DataTab from "./resultModalTabs/dataTab";
import SelectedProcesses from "./resultModalTabs/selectedProcesses";
import ResultTab from "./resultModalTabs/resultTab";

const ResultModal = ({
  handleResultCancel,
  isResultModal,
  dataDetails,
  fileName,
  processingDetails,
  result,
  workspaceTypeDetails,
}) => {
  const resultTabs = [
    {
      key: 1,
      label: "Data",
      children: <DataTab dataDetails={dataDetails} fileName={fileName} />,
    },
    {
      key: 2,
      label: "Selected Processes",
      children: (
        <SelectedProcesses
          dataDetails={dataDetails}
          processingDetails={processingDetails}
          workspaceTypeDetails={workspaceTypeDetails}
        />
      ),
    },
    {
      key: 3,
      label: "Result",
      children: (
        <ResultTab
          result={result}
          workspaceTypeDetails={workspaceTypeDetails}
        />
      ),
    },
  ];

  return (
    <>
      <Modal
        className="result-modal"
        open={isResultModal}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={handleResultCancel}
        closable={false}
      >
        <Tabs defaultActiveKey="1" type="card" items={resultTabs} />
      </Modal>
    </>
  );
};

export default ResultModal;
