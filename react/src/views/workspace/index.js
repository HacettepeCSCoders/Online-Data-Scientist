import React, {Suspense, useEffect, useState} from "react";
import {Button, Layout, Skeleton, Steps, Tag} from "antd";
import {steps} from "../../utils/workspace/steps";
import {DataProvider} from "../../hocs/dataProvider";
import {ProcessingProvider} from "../../hocs/proccesingProvider";
import {WorkspaceTypeProvider} from "../../hocs/workspaceTypeProvider";

const {Content, Sider} = Layout;

const Workspace = () => {
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    useEffect(() => {
        const unloadCallback = (event) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        };

        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
    }, []);

    const items = steps.map((item) => ({key: item.title, title: item.title}));

    return (
        <>
            <Suspense fallback={<Skeleton active/>}>
                <WorkspaceTypeProvider>
                    <DataProvider>
                        <ProcessingProvider>
                            <Layout className="layout-background">
                                <Layout>
                                    <Content className="content-nav">
                                        <Tag color="#9FB8AD">workspace2</Tag>
                                        <div className="workspace-content">
                                            {steps[current].content}
                                        </div>
                                        <div>
                                            {current > 0 && (
                                                <Button onClick={() => prev()}>Previous</Button>
                                            )}
                                            {current < steps.length - 1 && (
                                                <Button
                                                    className="workspace-nextButton"
                                                    onClick={() => next()}
                                                >
                                                    Next
                                                </Button>
                                            )}
                                        </div>
                                    </Content>
                                    <Sider className="workspace-sider">
                                        <Steps
                                            direction="vertical"
                                            current={current}
                                            items={items}
                                        ></Steps>
                                    </Sider>
                                </Layout>
                            </Layout>
                        </ProcessingProvider>
                    </DataProvider>
                </WorkspaceTypeProvider>
            </Suspense>
        </>
    );
};
export default Workspace;
