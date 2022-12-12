import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/form.css";
import logo from "../../assets/ods.png";
import LoginForm from "../../components/login/loginForm";
import { Col, Row } from "antd";

const Login = () => {
  const [values, setValues] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log(values);
  }, [values]);

  const onClickLogin = async (values) => {
    try {
      navigate("/signup");
    } catch {}
  };

  return (
    <>
      <div className="page-background ">
        <Row>
          <Col span={10} offset={11}>
            <img
              src={logo}
              style={{ width: "100px" }}
              onClick={onClickLogin}
            ></img>
          </Col>
        </Row>
        <Row className="form-location" gutter={16}>
          <Col className="gutter-row login-form" span={8} offset={8}>
            <LoginForm
              className="form-c"
              values={values}
              setValues={setValues}
              onClickLogin={onClickLogin}
            ></LoginForm>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Login;
