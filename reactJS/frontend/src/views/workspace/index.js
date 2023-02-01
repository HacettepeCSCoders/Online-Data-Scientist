import React, { Suspense, useState, useEffect } from "react";
import { Layout, Steps, Button, message, Space, Skeleton, Tag } from "antd";
import { steps } from "../../utils/workspace/steps";
import { DataProvider } from "../../hocs/dataProvider";
import { ProcessingProvider } from "../../hocs/proccesingProvider";
import { useData } from "../../hocs/dataProvider";
const { Content, Sider } = Layout;

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

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      <Suspense fallback={<Skeleton active />}>
        <DataProvider>
          <ProcessingProvider>
            <Layout className="layout-background">
              <Layout>
                <Content className="content-nav">
                  <Tag color="#9FB8AD">workspace2</Tag>
                  <div className="steps-content">{steps[current].content}</div>
                  <div className="steps-action">
                    {current < steps.length - 1 && (
                      <Button type="primary" onClick={() => next()}>
                        Next
                      </Button>
                    )}

                    {current > 0 && (
                      <Button
                        style={{ margin: "0 8px" }}
                        onClick={() => prev()}
                      >
                        Previous
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
      </Suspense>
    </>
  );
};
export default Workspace;
