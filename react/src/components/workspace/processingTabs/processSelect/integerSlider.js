import { Col, InputNumber, Row, Slider, Space } from "antd";
import React, { useState } from "react";

const IntegerSlider = ({ setValue, maxInput, maxSlider, defaultVal }) => {
  const [inputValue, setInputValue] = useState(defaultVal);
  const onChange = (newValue) => {
    setInputValue(newValue);
    setValue(newValue);
  };
  return (
    <Row>
      <Col span={12}>
        <Slider
          min={0}
          max={maxSlider}
          onChange={onChange}
          value={typeof inputValue === "number" ? inputValue : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={0}
          max={maxInput}
          style={{
            margin: "0 16px",
          }}
          value={inputValue}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default IntegerSlider;
