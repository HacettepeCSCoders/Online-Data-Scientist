import React from "react";
import KMeanForm from "./clusteringTabs/kMeanForm";
import DBScanForm from "./clusteringTabs/dbScanForm";
import { Tabs } from "antd";

const ClusteringForm = ({
  setValues,
  setWorkspaceTypeDetails,
  dataDetails,
}) => {
  const processingTabs = [
    {
      key: "1",
      label: `K-Mean`,
      children: (
        <KMeanForm
          setValues={setValues}
          setWorkspaceTypeDetails={setWorkspaceTypeDetails}
          dataDetails={dataDetails}
        />
      ),
    },
    {
      key: "2",
      label: `DB Scan`,
      children: (
        <DBScanForm
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
export default ClusteringForm;
