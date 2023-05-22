import React, { Suspense, useEffect, useState } from "react";
import { Col, Layout, List, Row, Skeleton } from "antd";
import { useProcessing } from "../../hocs/proccesingProvider";
import { useData } from "../../hocs/dataProvider";
import DataTable from "./dataTable/dataTable";
import getColumnsStruct from "../../utils/workspace/getColumnsStruct";

const { Content } = Layout;

const StartProcessing = () => {
  const { processingDetails } = useProcessing();
  const [processingKeys, setProcessingKeys] = useState();
  const [processingValues, setProcessingValues] = useState();
  const [processingValuesShow, setProcessingValueShow] = useState();
  const { dataDetails } = useData();

  const colArr = getColumnsStruct(dataDetails);

  useEffect(() => {
    if (processingDetails !== undefined) {
      setProcessingKeys(Object.keys(processingDetails));
      setProcessingValues(Object.values(processingDetails));
      let arr = [];
      for (let i = 0; i < Object.values(processingDetails).length; i++) {
        if (Object.values(processingDetails)[i] === undefined) {
          arr[i] = "not selected";
        } else {
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
            arr[i] = arrToDropColumns;
          } else {
            arr[i] = Object.values(processingDetails)[i];
          }
        }
      }
      setProcessingValueShow(arr);
    }
  }, []);

  useEffect(() => {
    console.log(processingKeys);
    console.log(processingValues);
  }, [processingKeys, processingValues]);

  return (
    <>
      <Row>
        {processingDetails === undefined && (
          <div> Please Select Processing</div>
        )}
        <Col span={4}>
          {processingKeys && (
            <List
              dataSource={processingKeys}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          )}
        </Col>
        <Col span={4}>
          {processingValuesShow && (
            <List
              className="list-processingKeys"
              dataSource={processingValuesShow}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          )}
        </Col>
        <Col span={12}>
          <Suspense fallback={<Skeleton active />}>
            {dataDetails && (
              <Content className="workspace-table-content csv-table-overflow ">
                <DataTable dataDetails={dataDetails}></DataTable>
              </Content>
            )}
          </Suspense>
        </Col>
      </Row>
    </>
  );
};

export default StartProcessing;
