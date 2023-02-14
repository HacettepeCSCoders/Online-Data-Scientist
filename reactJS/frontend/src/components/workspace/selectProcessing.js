import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import DataManipulationForm from "./processingTabs/dataManipulationForm";
import StatisticalProcessingForm from "./processingTabs/statisticalProcessingForm";
import { useProcessing } from "../../hocs/proccesingProvider";
import { useWorkspaceType } from "../../hocs/workspaceTypeProvider";
const SelectProcessing = () => {
  const [values, setValues] = useState();
  const { processingDetails, setProcessingDetails } = useProcessing();
  const { workspaceTypeDetails, setWorkspaceTypeDetails } = useWorkspaceType();

  useEffect(() => {
    setProcessingDetails(values);
    onClickSave();
  }, [values]);

  const onClickSave = () => {
    console.log(values);
    console.log(processingDetails);
  };

  const processingTabs = [
    {
      key: "1",
      label: `Data Manipulation`,
      children: <DataManipulationForm values={values} setValues={setValues} />,
    },
    {
      key: "2",
      label: `Statistical`,
      children: <StatisticalProcessingForm />,
    },
  ];

  const machineLearningTabs = [
    {
      key: "1",
      label: "Machine Learning",
      children: <div> sag</div>,
    },
  ];

  return (
    <>
      <div> Select Preprocessing Tehniques</div>
      <Tabs defaultActiveKey="1" type="card" items={processingTabs} />
    </>
  );
};

export default SelectProcessing;
