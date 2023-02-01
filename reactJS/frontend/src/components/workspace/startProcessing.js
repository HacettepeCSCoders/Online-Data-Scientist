import React, { useEffect, useState, Suspense } from "react";
import { Row, Col, List, Skeleton, Layout, Button } from "antd";
import { useProcessing } from "../../hocs/proccesingProvider";
import { CsvToHtmlTable } from "react-csv-to-table";
import { useData } from "../../hocs/dataProvider";
import { startProcess } from "../../services/processService";
const { Content } = Layout;

const StartProcessing = () => {
  const { processingDetails } = useProcessing();
  const [processingKeys, setProcessingKeys] = useState();
  const [processingValues, setProcessingValues] = useState();
  const [processingValuesShow, setProcessingValueShow] = useState();
  const { dataDetails } = useData();

  useEffect(() => {
    if (processingDetails !== undefined) {
      setProcessingKeys(Object.keys(processingDetails));
      setProcessingValues(Object.values(processingDetails));
      let arr = [];
      for (let i = 0; i < Object.values(processingDetails).length; i++) {
        if (Object.values(processingDetails)[i] === undefined) {
          arr[i] = "not selected";
        } else {
          arr[i] = Object.values(processingDetails)[i];
        }
      }
      setProcessingValueShow(arr);
    }
  }, []);

  useEffect(() => {
    console.log(processingKeys);
    console.log(processingValues);
  }, [processingKeys, processingValues]);

  const onClickStart = async () => {
    if (processingDetails !== undefined && processingDetails !== undefined) {
      try {
        const response = await startProcess(processingDetails, dataDetails);
      } catch {
        console.error();
      }
    }
  };

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
              dataSource={processingValuesShow}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          )}
        </Col>
        <Col span={12}>
          <Suspense fallback={<Skeleton active />}>
            {dataDetails && (
              <Content className="workspace-table-content csv-table-overflow ">
                <CsvToHtmlTable
                  tableRowClassName="csv-table-row-back"
                  data={dataDetails}
                  csvDelimiter=","
                />
              </Content>
            )}
          </Suspense>
        </Col>
      </Row>
      <Button onClick={onClickStart}> Start</Button>
    </>
  );
};

export default StartProcessing;
