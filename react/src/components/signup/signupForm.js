import React from "react";
import { Anchor, Button, Form, Input, Alert } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Link } = Anchor;

export const SignupForm = ({ onClickSignup, error, setError }) => {
  const onFinish = (values) => {
    setError(undefined);

    if (values.password !== values.confirmPassword) {
      setError("Password mismatch");
      return;
    }
    onClickSignup(values);
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
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <h1> Sign Up</h1>
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

      <Form.Item
        name="confirmPassword"
        rules={[{ required: true, message: "Please enter your password!" }]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Confirm Password"
        />
      </Form.Item>
      {error && <Alert message={error} type="error" showIcon closable />}
      <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
        <Button type="primary" htmlType="submit" className="form-button-color">
          Create account
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
        <Link href="/login" title="Already Have account?"></Link>
      </Form.Item>
    </Form>
  );
};

export default SignupForm;
