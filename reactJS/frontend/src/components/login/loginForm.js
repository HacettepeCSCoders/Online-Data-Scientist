import React from "react";
import { Button, Form, Input, Anchor } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
const { Link } = Anchor;

export const LoginForm = ({ setValues, onClickLogin }) => {
  const onFinish = (values) => {
    console.log("finish");
    setValues(values);
    onClickLogin();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="form-center"
    >
      <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
        <h1> Sıgn In With</h1>
      </Form.Item>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please enter your username!" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please enter your password!" }]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button htmlType="submit" className="form-button-color">
          Login
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
        <Link
          href="signup"
          title="Forgot Password?"
          className="form-link-color"
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
        <Link href="signup" title="Don't have a account?"></Link>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
