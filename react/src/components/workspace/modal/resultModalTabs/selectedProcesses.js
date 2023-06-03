import React, { useEffect, useState } from "react";
import { useProcessing } from "../../../../hocs/proccesingProvider";
import { Descriptions } from "antd";
import getColumnsStruct from "../../../../utils/workspace/getColumnsStruct";
import { useData } from "../../../../hocs/dataProvider";

const SelectedProcesses = ({ processingDetails, dataDetails }) => {
  const [processes, setProcesses] = useState([]);
  const colArr = getColumnsStruct(dataDetails);

  useEffect(() => {
    let arr = [];
    if (processingDetails !== undefined) {
      for (let i = 0; i < Object.values(processingDetails).length; i++) {
        if (Object.values(processingDetails)[i] !== undefined) {
          let processObject = {};
          processObject["key"] = Object.keys(processingDetails)[i];
          if (Object.keys(processingDetails)[i] === "to_drop_columns") {
            let arrToDropColumns = [];
            Object.values(processingDetails)[i].forEach((element) => {
              console.log("Element ", element);
              colArr.forEach((item) => {
                if (element === item.id) {
                  arrToDropColumns.push(item.name);
                  console.log(element, item.id, item.name);
                }
              });
            });
            processObject["value"] = arrToDropColumns.join(", ");
            arr.push(processObject);
            continue;
          }
          processObject["value"] = Object.values(processingDetails)[i];
          arr.push(processObject);
          console.log(arr);
        }
      }
    }
    setProcesses(arr);
  }, []);
  return (
    <>
      <Descriptions
        title="Preprocesses"
        size="middle"
        layout="vertical"
        bordered
      >
        {processes &&
          processes.map((item) => (
            <Descriptions.Item label={item.key}>{item.value}</Descriptions.Item>
          ))}
      </Descriptions>
    </>
  );
};

export default SelectedProcesses;
