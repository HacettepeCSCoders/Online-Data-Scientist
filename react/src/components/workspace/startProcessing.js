import React, {Suspense, useEffect, useState} from "react";
import {Button, Col, Layout, List, message, Row, Skeleton} from "antd";
import {useProcessing} from "../../hocs/proccesingProvider";
import {useData} from "../../hocs/dataProvider";
import {startProcess} from "../../services/processService";
import DataTable from "./dataTable/dataTable";

const {Content} = Layout;

const StartProcessing = () => {
    const {processingDetails} = useProcessing();
    const [processingKeys, setProcessingKeys] = useState();
    const [processingValues, setProcessingValues] = useState();
    const [processingValuesShow, setProcessingValueShow] = useState();
    const {dataDetails} = useData();
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: "success",
            content: "Processing successfully started",
        });
    };

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
            success();
        }
    };

    return (
        <>
            {contextHolder}
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
                    <Suspense fallback={<Skeleton active/>}>
                        {dataDetails && (
                            <Content className="workspace-table-content csv-table-overflow ">
                                <DataTable dataDetails={dataDetails}></DataTable>
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
