import React from "react";
import { Layout, Image } from "antd";
import image from "../../assets/homePageImage.png";

const { Content } = Layout;

const HomePage = () => {
  return (
    <>
      <Image preview={false} src={image} />
      <Content className="content-nav"></Content>
    </>
  );
};

export default HomePage;
