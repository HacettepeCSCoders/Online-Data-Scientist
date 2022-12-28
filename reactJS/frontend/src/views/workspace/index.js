import React, { useState } from "react";
import { Layout, Steps, Button, message } from "antd";
import { steps } from "../../utils/workspace/steps";
import { DataProvider } from "../../hocs/dataProvider";
const { Content, Sider } = Layout;

const Workspace = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      <DataProvider>
        <Layout className="layout-background">
          <Layout>
            <Content className="content-nav">
              <div className="steps-content">{steps[current].content}</div>
              <div className="steps-action">
                {current < steps.length - 1 && (
                  <Button type="primary" onClick={() => next()}>
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => message.success("Processing complete!")}
                  >
                    Done
                  </Button>
                )}
                {current > 0 && (
                  <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                    Previous
                  </Button>
                )}
              </div>
            </Content>
            <Sider className="workspace-header">
              <Steps
                direction="vertical"
                current={current}
                items={items}
              ></Steps>
            </Sider>
          </Layout>
        </Layout>
      </DataProvider>
    </>
  );
};
export default Workspace;
