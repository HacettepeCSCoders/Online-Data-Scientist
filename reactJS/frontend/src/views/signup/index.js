import React, { useState, useEffect } from "react";
import "../../styles/form.css";
import logo from "../../assets/ods.png";
import SignupForm from "../../components/signup/signupForm";
import { Col, Row } from "antd";

const Signup = () => {
  const [values, setValues] = useState();

  useEffect(() => {
    console.log(values);
  }, []);

  const onClickSignup = () => {};
  return (
    <>
      <div className="page-background ">
        <Row className="form-location" gutter={16}>
          <Col className="gutter-row login-form" span={8} offset={8}>
            <SignupForm
              className="form-c"
              values={values}
              setValues={setValues}
              onClickSignup={onClickSignup}
            ></SignupForm>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Signup;
