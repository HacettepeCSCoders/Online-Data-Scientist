import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Image, Button, Tag } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import dataManipulationImage from "../../assets/dataManipulation.png";
import machineLearningImage from "../../assets/machineLearningImage.jpg";
import { useWorkspaceType } from "../../hocs/workspaceTypeProvider";

const { Title } = Typography;

const WelcomeWorkspace = () => {
  const [workspaceType, setWorkspaceType] = useState();
  const { setWorkspaceTypeDetails } = useWorkspaceType();

  useEffect(() => {
    setWorkspaceTypeDetails(workspaceType);
  });

  return (
    <>
      <Row className="welcome-firstRow-margin">
        <Col lg={{ span: 15, offset: 5 }}>
          <Title>Welcome To Workspace Page</Title>
          <Paragraph>
            After this stage, we will help you make the best use of the data we
            have. First of all, please select the field for which you will use
            the data you have.
          </Paragraph>
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
              </Button>
            </Col>
            <Col lg={{ span: 5, offset: 5 }}>
              <Button
                onClick={() => {
                  setWorkspaceType("Machine Learning");
                }}
              >
                <Image width={200} src={machineLearningImage} preview={false} />
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
