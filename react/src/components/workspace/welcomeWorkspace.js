import { Layout, Image } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import welcomeImage from "../../assets/homePageImage.png";
const { content } = Layout;

const WelcomeWorkspace = () => {
  return (
    <>
      <Content>
        <Image preview={false} src={welcomeImage}></Image>
      </Content>
    </>
  );
};

export default WelcomeWorkspace;
