import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import DataManipulationForm from "./processingTabs/dataManipulationForm";
import StatisticalProcessingForm from "./processingTabs/statisticalProcessingForm";
import { useProcessing } from "../../hocs/proccesingProvider";
const SelectProcessing = () => {
  const [values, setValues] = useState();
  const { processingDetails, setProcessingDetails } = useProcessing();

  useEffect(() => {
    setProcessingDetails(values);
    onClickSave();
  }, [values]);

  const onClickSave = () => {
    console.log(values);
    console.log(processingDetails);
  };

  const tabs = [
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

  return (
    <>
      <div> Select Preprocessing Tehniques</div>
      <Tabs defaultActiveKey="1" type="card" items={tabs} />
    </>
  );
};

export default SelectProcessing;
