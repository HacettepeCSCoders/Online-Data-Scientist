import React from "react";
import {Avatar, Col, Dropdown, Input, Layout, Row} from "antd";
import {LogoutOutlined, SearchOutlined, UserOutlined,} from "@ant-design/icons";

const {Header} = Layout;

const TopBar = () => {
    const onClickLogout = () => {
    };

    const items = [
        {
            key: "1",
            label: <div> Signed as burakdag</div>,
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
                    Sign Out <LogoutOutlined/>
                </div>
            ),
        },
    ];
    return (
        <>
            <Header className="header-nav">
                <Row gutter={16}>
                    <Col span={8} offset={4}>
                        <Input
                            prefix={<SearchOutlined className="site-form-item-icon"/>}
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
                            <Avatar size={48} icon={<UserOutlined/>}/>
                        </Dropdown>
                    </Col>
                </Row>
            </Header>
        </>
    );
};

export default TopBar;
