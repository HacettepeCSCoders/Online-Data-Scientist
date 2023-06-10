import React, { useEffect, useState } from "react";
import { Descriptions, Tag } from "antd";
import getColumnsStruct from "../../../../utils/workspace/getColumnsStruct";

const SelectedProcesses = ({
  processingDetails,
  dataDetails,
  workspaceTypeDetails,
}) => {
  const [processes, setProcesses] = useState([]);
  const [statisticalTest, setStatisticalTest] = useState([]);
  const colArr = getColumnsStruct(dataDetails);

  useEffect(() => {
    if (workspaceTypeDetails == "dataManipulation") {
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
            } else if (
              Object.keys(processingDetails)[i] === "to_drop_rows" ||
              Object.keys(processingDetails)[i] === "non_num_cols"
            ) {
              processObject["value"] =
                Object.values(processingDetails)[i].join(", ");
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
      console.log(arr);
    } else if (workspaceTypeDetails == "statistical") {
      setStatisticalTest(processingDetails);
    }
  }, []);
  return (
    <>
      <Descriptions
        title={
          workspaceTypeDetails == "statistical"
            ? "Statistical Test"
            : "Data Manipulation"
        }
        size="middle"
        layout="vertical"
        bordered={true}
        column={1}
      >
        {processes &&
          processes.map((item) => (
            <Descriptions.Item
              label={<Tag className="nav-background">{item.key} </Tag>}
            >
              {"Columns: "}
              <Tag> {item.value}</Tag>
            </Descriptions.Item>
          ))}
        {statisticalTest &&
          statisticalTest.map((item) => {
            return (
              <>
                <Descriptions.Item
                  label={
                    <Tag className="nav-background">{item.test_name} </Tag>
                  }
                >
                  {"Columns: "}
                  <Tag>{item.column_1} </Tag>
                  {item.column_2 && <Tag>{item.column_2} </Tag>}
                  {item.column_3 && <Tag>{item.column_3} </Tag>}
                </Descriptions.Item>
                <br />
              </>
            );
          })}
      </Descriptions>
    </>
  );
};

export default SelectedProcesses;
