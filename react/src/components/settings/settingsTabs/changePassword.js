import React, { useState } from "react";
import { Button, Form, Input, Alert } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { changePassword } from "../../../services/authService";

const ChangePassword = ({ name }) => {
  const [error, setError] = useState(undefined);
  const onFinish = async (values) => {
    setError(undefined);
    values.username = name;
    if (values.newPassword !== values.confirmPassword) {
      setError("Password mismatch");
      return;
    }
    delete values.confirmPassword;
    try {
      const response = await changePassword(values);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
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
        <Form.Item
          name="oldPassword"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Old Password"
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="New Password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Confirm New Password"
          />
        </Form.Item>
        {error && <Alert message={error} type="error" showIcon closable />}
        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button htmlType="submit" className="dark-background">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePassword;
