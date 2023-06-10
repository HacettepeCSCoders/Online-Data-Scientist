import { Checkbox, Form, Tabs } from "antd";
import React, { useState } from "react";
import KnnForm from "./classificationTabs/knnForm";

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
  ];
  return (
    <>
      <Tabs defaultActiveKey="1" type="card" items={processingTabs} />
    </>
  );
};

export default ClassificationForm;
