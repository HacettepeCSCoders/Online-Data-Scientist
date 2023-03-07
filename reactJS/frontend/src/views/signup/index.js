import React, { useState, useEffect } from "react";
import "../../styles/form.css";
import SignupForm from "../../components/signup/signupForm";
import { Col, Row } from "antd";
import { useDispatch } from "react-redux";
import { signupHandler } from "../../reducers/actions/authActions";

const Signup = () => {
  const dispatch = useDispatch();

  const onClickSignup = async (values) => {
    console.log("Post sent");
    console.log(values);
    delete values.confirmPassword;
    try {
      dispatch(signupHandler(values));
    } catch (apiError) {
      console.log(apiError);
    }
  };

  return (
    <>
      <div className="page-background ">
        <Row className="form-location" gutter={16}>
          <Col className="gutter-row login-form" span={8} offset={8}>
            <SignupForm
              className="form-c"
              onClickSignup={onClickSignup}
            ></SignupForm>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Signup;
