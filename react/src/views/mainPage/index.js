import React from "react";
import { Layout, Menu, Card, Button, Row, Col } from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Content } = Layout;

const MainPage = () => {
  let navigate = useNavigate();
  return (
    <>
      <Content className="main-container">
        <div>
          <Card>
            <h1 className="main-h1"> Welcome To Online Data Scientist</h1>
            <Button
              className="dark-background main-button"
              onClick={() => navigate(`/signup`)}
            >
              Get Started
            </Button>
          </Card>
        </div>
        <div>
          <h1>Our Features </h1>
          <Row className="main-container" justify="space-evenly">
            <Col span={8}>
              <Card className="main-card">
                <div>
                  <BarChartOutlined className="main-icon" />
                  <h4>Powerful Analytics</h4>
                  <p>Perform advanced statistical analytics.</p>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="main-card">
                <div>
                  <LineChartOutlined className="main-icon" />
                  <h4>Machine Learning</h4>
                  <p>
                    Perform powerful machine learning tasks without writing
                    code.
                  </p>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="main-card">
                <div>
                  <DatabaseOutlined className="main-icon" />
                  <h4>Cloud Storage</h4>
                  <p>Store and manage your data securely in the cloud.</p>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </>
  );
};

export default MainPage;
