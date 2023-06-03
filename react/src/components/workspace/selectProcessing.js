import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import DataManipulationForm from "./processingTabs/dataManipulationForm";
import StatisticalProcessingForm from "./processingTabs/statisticalProcessingForm";
import { useProcessing } from "../../hocs/proccesingProvider";

const SelectProcessing = ({ newWorkspace }) => {
  const [values, setValues] = useState();
  const { setProcessingDetails } = useProcessing();

  useEffect(() => {
    let check = false;
    if (values !== undefined) {
      for (const [key, value] of Object.entries(values)) {
        console.log(value);
        if (value !== undefined) {
          check = true;
          break;
        }
      }
    }
    check && setProcessingDetails(values);
  }, [values]);

  let processingTabs = [];
  console.log(newWorkspace);

  newWorkspace
    ? (processingTabs = [
        {
          key: "1",
          label: `Data Manipulation`,
          children: (
            <DataManipulationForm values={values} setValues={setValues} />
          ),
        },
      ])
    : (processingTabs = [
        {
          key: "1",
          label: `Data Manipulation`,
          children: (
            <DataManipulationForm values={values} setValues={setValues} />
          ),
        },
        {
          key: "2",
          label: `Statistical`,
          children: <StatisticalProcessingForm />,
        },
        {
          key: "3",
          label: "Machine Learning",
          children: <div> sag</div>,
        },
      ]);

  return (
    <>
      <Tabs defaultActiveKey="1" type="card" items={processingTabs} />
    </>
  );
};

export default SelectProcessing;
