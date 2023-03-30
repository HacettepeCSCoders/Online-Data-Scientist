import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  PieChartOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import logo from "../../../assets/logo1.png";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;
const SideBar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const onClickPlus = () => {
    const workspaceId = Date.now();
    navigate(`/workspace/${workspaceId}`);
  };

  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        className="sider-navigate"
      >
        <div>
          <img src={logo} className="logo-size" />
        </div>

        <Menu theme="dark" mode="inline" className="sider-menu">
          <Menu.Item className="create-workspace-back" key="0">
            <div onClick={onClickPlus}>
              <PlusOutlined />
            </div>
          </Menu.Item>
          <Menu.Item key="1" className="customclass">
            <div onClick={() => navigate("/home")}>
              <HomeOutlined /> HomePage
            </div>
          </Menu.Item>
          <Menu.Item key="2" className="customclass">
            <div onClick={() => navigate("/workspace")}>
              <PieChartOutlined /> Workspace
            </div>
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};

export default SideBar;
