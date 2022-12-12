import React from "react";
import { Layout, Menu } from "antd";
const { Header } = Layout;

const TopBar = () => {
  return (
    <>
      <Header className="header-nav">
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          className="header-menu"
        />
      </Header>
    </>
  );
};

export default TopBar;
