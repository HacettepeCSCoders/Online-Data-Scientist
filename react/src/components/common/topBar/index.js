import React, { useEffect } from "react";
import { Avatar, Button, Col, Dropdown, Input, Layout, Row } from "antd";
import {
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutSuccess } from "../../../reducers/actions/authActions";
import logo from "../../../assets/logo1.png";

const { Header } = Layout;

const TopBar = ({ name, isLoggedIn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(isLoggedIn);
  }, []);
  const onClickLogout = () => {
    dispatch(logoutSuccess());
  };

  const items = [
    {
      key: "1",
      label: <div> Signed as {name}</div>,
      disabled: true,
    },
    {
      key: "2",
      label: <a href="/settings">Settings</a>,
    },
    {
      key: "3",
      label: <a href="/burakdag">Your Profile</a>,
    },
    {
      key: "4",
      label: (
        <div onClick={onClickLogout}>
          Sign Out <LogoutOutlined />
        </div>
      ),
    },
  ];

  let checkLoggedTopbar = (
    <Row gutter={16}>
      <Col>
        <div>
          <img src={logo} className="logo-size-topbar" />
        </div>
      </Col>
      <Col offset={18}>
        <Button className="dark-background" onClick={() => navigate(`/signup`)}>
          Sign Up
        </Button>
      </Col>
      <Col>
        <Button className="dark-background" onClick={() => navigate(`/login`)}>
          Login
        </Button>
      </Col>
    </Row>
  );
  if (isLoggedIn) {
    checkLoggedTopbar = (
      <Row gutter={16}>
        <Col span={8} offset={4}>
          <Input
            prefix={<SearchOutlined className="site-form-item-icon" />}
            placeholder="Search..."
            type="text"
          />
        </Col>
        <Col className="gutter-row" span={2} offset={6}>
          <Dropdown
            menu={{
              items,
            }}
          >
            <Avatar size={48} icon={<UserOutlined />} />
          </Dropdown>
        </Col>
      </Row>
    );
  }
  return (
    <>
      <Header className="header-nav">{checkLoggedTopbar}</Header>
    </>
  );
};

export default TopBar;
