import { Form, Button } from "antd";
import React, { useState } from "react";
import DropColumnSelect from "../../processSelect/dropColumnSelect";
import IntegerSlider from "../../processSelect/integerSlider";
import DecimalSlider from "../../processSelect/decimalSlider";

const DBScanForm = ({ setValues, setWorkspaceTypeDetails }) => {
  const [learnigColumns, setLearningColumns] = useState();
  const [label, setLabel] = useState();
  const [eps, setEps] = useState(0.2);
  const [minSamples, setMinSamples] = useState(5);

  const onFinish = (values) => {
    values.columns = learnigColumns;
    values.target_column = label;

    setValues(values);
    setWorkspaceTypeDetails("dbScan");
  };
  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="columns"
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

export default DBScanForm;
