import { Tabs } from "antd";
import React from "react";
import KnnForm from "./classificationTabs/knnForm";
import SvmForm from "./classificationTabs/svmForm";

const ClassificationForm = ({
  setValues,
  setWorkspaceTypeDetails,
  dataDetails,
}) => {
  const processingTabs = [
    {
      key: "1",
      label: `K-Nearest Neighbor`,
      children: (
        <KnnForm
          setValues={setValues}
          setWorkspaceTypeDetails={setWorkspaceTypeDetails}
          dataDetails={dataDetails}
        />
      ),
    },
    {
      key: "2",
      label: `Support Vector Machine`,
      children: (
        <SvmForm
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

export default ClassificationForm;
