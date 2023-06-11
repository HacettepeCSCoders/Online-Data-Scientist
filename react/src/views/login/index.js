import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/form.css";
import LoginForm from "../../components/login/loginForm";
import { Col, Row } from "antd";
import { loginHandler } from "../../reducers/actions/authActions";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState();

  const onClickLogin = async (values) => {
    try {
      await dispatch(loginHandler(values));
      navigate("/");
    } catch (apiError) {
      console.log(apiError);
      console.log("aas");
      setError("Please give correct credentials");
    }
  };

  return (
    <>
      <div className="page-background ">
        <Row className="form-location" gutter={16}>
          <Col className="gutter-row login-form" span={8} offset={8}>
            <LoginForm
              className="form-c"
              onClickLogin={onClickLogin}
              error={error}
              setError={setError}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Login;
