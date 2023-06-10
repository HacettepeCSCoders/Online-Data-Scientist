import React from "react";
import { Layout, Tabs, Avatar, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import ChangePassword from "../../components/settings/settingsTabs/changePassword";

const { Content } = Layout;

const Settings = () => {
  const { name } = useSelector((store) => ({
    name: store.name,
  }));

  const tabs = [
    {
      key: 1,
      label: "Change Password",
      children: <ChangePassword name={name} />,
    },
  ];
  return (
    <>
      <Content className="content-nav">
        <div className="setting-user">
          <Avatar size={48} icon={<UserOutlined />} />
          <Tag> {name}</Tag>
        </div>
        <Tabs tabPosition={"left"} items={tabs} />
      </Content>
    </>
  );
};

export default Settings;
