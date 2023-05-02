import React, { useState } from "react";
import { Layout, Menu, Row, Col } from "antd";
import {
  HomeOutlined,
  PieChartOutlined,
  PlusOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import logo from "../../../assets/logo1.png";
import { useNavigate } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";

const { Sider } = Layout;
const SideBar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const onClickPlus = () => {
    const workspaceId = Date.now();
    navigate(`/workspace/${workspaceId}/new`);
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
              <Row>
                <Col>
                  <HomeOutlined className="icon-font" />
                </Col>
                <Col>HomePage</Col>
              </Row>
            </div>
          </Menu.Item>
          <Menu.Item key="2" className="customclass">
            <div onClick={() => navigate("/workspace")}>
              <Row>
                <Col>
                  <PieChartOutlined className="icon-font" />
                </Col>
                <Col>
                  <div> Workspace</div>
                </Col>
              </Row>
            </div>
          </Menu.Item>
          <Menu.Item key="3" className="customclass">
            <div onClick={() => navigate("/panel")}>
              <Row>
                <Col>
                  <RiAdminFill className="icon-font" />
                </Col>
                <Col>
                  <div> Panel </div>
                </Col>
              </Row>
            </div>
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};

export default SideBar;
