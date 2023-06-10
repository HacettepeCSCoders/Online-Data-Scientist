import { Checkbox, Form, Select, Transfer, Row, Col, Button } from "antd";
import React, { useState } from "react";
import DropColumnSelect from "../../processSelect/dropColumnSelect";
import IntegerSlider from "../../processSelect/integerSlider";
import DecimalSlider from "../../processSelect/decimalSlider";

const KnnForm = ({ setValues, setWorkspaceTypeDetails, dataDetails }) => {
  const [learnigColumns, setLearningColumns] = useState();
  const [label, setLabel] = useState();
  const [kValue, setKValue] = useState(3);
  const [testSize, setTestSize] = useState(0.2);
  const [randomState, setRandomState] = useState(42);

  const onFinish = (values) => {
    values.to_learn_columns = learnigColumns;
    values.target_column = label;
    values.k = kValue;
    values.test_size = testSize;
    values.random_state = randomState;

    setValues(values);
    setWorkspaceTypeDetails("knn");
  };
  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="to_learn_columns"
        label="Learn Columns"
        required={true}
        wrapperCol={{ offset: 0, span: 8 }}
      >
        <DropColumnSelect
          setColumnArray={setLearningColumns}
          colNameOrId={"name"}
          mode={"multiple"}
        ></DropColumnSelect>
      </Form.Item>
      <Form.Item
        name="target_column"
        label="Label"
        required={true}
        wrapperCol={{ offset: 0, span: 8 }}
      >
        <DropColumnSelect
          setColumnArray={setLabel}
          colNameOrId={"name"}
          mode={null}
        ></DropColumnSelect>
      </Form.Item>
      <Form.Item name="k" label="K-Value" wrapperCol={{ offset: 0, span: 8 }}>
        <IntegerSlider
          setValue={setKValue}
          maxInput={100}
          maxSlider={20}
          defaultVal={3}
        />
      </Form.Item>
      <Form.Item
        name="test_size"
        label="Test Size"
        wrapperCol={{ offset: 0, span: 8 }}
      >
        <DecimalSlider
          setValue={setTestSize}
          maxInput={0.9}
          maxSlider={0.9}
          defaultVal={0.2}
        />
      </Form.Item>
      <Form.Item
        name="random_state"
        label="Random State"
        wrapperCol={{ offset: 0, span: 8 }}
      >
        <IntegerSlider
          setValue={setRandomState}
          maxInput={100}
          maxSlider={100}
          defaultVal={42}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button
          type="primary"
          htmlType="submit"
          className="form-button-color"
          disabled={
            label === undefined ||
            learnigColumns === undefined ||
            learnigColumns === []
          }
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default KnnForm;
