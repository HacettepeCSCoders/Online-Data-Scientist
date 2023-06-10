import { Col, InputNumber, Row, Slider } from "antd";
import React, { useState } from "react";

const DecimalSlider = ({ setValue, maxInput, maxSlider, defaultVal }) => {
  const [inputValue, setInputValue] = useState(defaultVal);
  const onChange = (value) => {
    if (isNaN(value)) {
      return;
    }
    setInputValue(value);
    setValue(value);
  };
  return (
    <Row>
      <Col span={12}>
        <Slider
          min={0}
          max={maxSlider}
          onChange={onChange}
          value={typeof inputValue === "number" ? inputValue : 0}
          step={0.01}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={0}
          max={maxInput}
          style={{
            margin: "0 16px",
          }}
          step={0.01}
          value={inputValue}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};
export default DecimalSlider;
