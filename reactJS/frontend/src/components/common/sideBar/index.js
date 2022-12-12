import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  PieChartOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import logo from "../../../assets/logo1.png";
import { useNavigate } from "react-router-dom";
const { Sider } = Layout;
const SideBar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const workspaceId = 2;

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
            <div onClick={() => navigate(`/workspace/${workspaceId}`)}>
              <PlusOutlined />
            </div>
          </Menu.Item>
          <Menu.Item
            key="1"
            className="customclass"
            // onClick={onClickItem("/homepage")}
          >
            <div onClick={() => navigate("/homepage")}>
              <HomeOutlined /> HomePage
            </div>
          </Menu.Item>
          <Menu.Item key="2" className="customclass">
            <div onClick={() => navigate("/homepage")}>
              <PieChartOutlined /> Workspace
            </div>
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};

export default SideBar;
