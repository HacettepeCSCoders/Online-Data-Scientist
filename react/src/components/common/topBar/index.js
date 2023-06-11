import React, { useEffect } from "react";
import { Avatar, Button, Col, Dropdown, Input, Layout, Row, Tag } from "antd";
import {
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutSuccess } from "../../../reducers/actions/authActions";
import logo from "../../../assets/favicon_s.png";
import SearchBar from "../../searchBar";

const { Header } = Layout;

const TopBar = ({ name, isLoggedIn, userId }) => {
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
          <img
            src={logo}
            className="logo-size-topbar"
            onClick={() => navigate(`/`)}
          />
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
          <SearchBar userId={userId} />
        </Col>
        <Col className="gutter-row" span={6} offset={6}>
          <Tag color="#3F403F">{name}</Tag>
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
