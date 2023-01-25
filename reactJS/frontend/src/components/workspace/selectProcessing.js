import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import DataManipulationForm from "./processingTabs/dataManipulationForm";
import StatisticalProcessingForm from "./processingTabs/statisticalProcessingForm";
const SelectProcessing = () => {
  const [values, setValues] = useState();

  useEffect(() => {
    onClickSave();
  }, [values]);

  const onClickSave = () => {
    console.log(values);
  };

  const tabs = [
    {
      key: "1",
      label: `Data Manipulation`,
      children: (
        <DataManipulationForm
          values={values}
          setValues={setValues}
          onClickSave={onClickSave}
        />
      ),
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
