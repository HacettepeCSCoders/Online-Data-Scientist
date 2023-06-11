import React from "react";
import ClusteringForm from "./machineLearningTabs/clusteringForm";
import { Tabs } from "antd";
import ClassificationForm from "./machineLearningTabs/classificationForm";

const MachineLearningForm = ({
  setValues,
  setWorkspaceTypeDetails,
  dataDetails,
}) => {
  const processingTabs = [
    {
      key: "1",
      label: `Clustering`,
      children: (
        <ClusteringForm
          setValues={setValues}
          setWorkspaceTypeDetails={setWorkspaceTypeDetails}
          dataDetails={dataDetails}
        />
      ),
    },
    {
      key: "2",
      label: `Classification`,
      children: (
        <ClassificationForm
          setValues={setValues}
          setWorkspaceTypeDetails={setWorkspaceTypeDetails}
          dataDetails={dataDetails}
        />
      ),
    },
  ];
  return (
    <>
      <Tabs defaultActiveKey="1" type="card" items={processingTabs} />
    </>
  );
};

export default MachineLearningForm;
