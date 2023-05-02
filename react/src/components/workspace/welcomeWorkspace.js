import React, { useEffect, useState } from "react";
import { Button, Col, Descriptions, Image, Row, Tag, Typography } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import dataManipulationImage from "../../assets/dataManipulation.png";
import machineLearningImage from "../../assets/machineLearningImage.jpg";
import { useWorkspaceType } from "../../hocs/workspaceTypeProvider";
import { PageHeader } from "@ant-design/pro-layout";

const { Title } = Typography;

const WelcomeWorkspace = () => {
  const [workspaceType, setWorkspaceType] = useState();
  const { setWorkspaceTypeDetails } = useWorkspaceType();

  useEffect(() => {
    setWorkspaceTypeDetails(workspaceType);
  });

  return (
    <>
      <br />
      <br />
      <Row>
        <Col lg={{ span: 15, offset: 5 }}>
          <Row>
            <Col lg={{ span: 5, offset: 2 }}>
              <Button
                className="welcome-workspace-button"
                onClick={() => {
                  setWorkspaceType("Data Manipulation");
                }}
              >
                <Image
                  width={200}
                  src={dataManipulationImage}
                  preview={false}
                />
                <Row>
                  <Tag color="#FF492C">Data Manipulation</Tag>
                </Row>
              </Button>
            </Col>
            <Col lg={{ span: 5, offset: 6 }}>
              <Button
                onClick={() => {
                  setWorkspaceType("Machine Learning");
                }}
              >
                <Image width={200} src={machineLearningImage} preview={false} />
                <Row>
                  <Tag color="#9FB8AD">Machine Learning</Tag>
                </Row>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      {workspaceType && (
        <Col lg={{ span: 5, offset: 11 }}>
          <Tag color="#9FB8AD"> {workspaceType} </Tag>
        </Col>
      )}
    </>
  );
};

export default WelcomeWorkspace;
