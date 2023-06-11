import { Form, Button, Select, Space } from "antd";
import React, { useState } from "react";
import DropColumnSelect from "../../processSelect/dropColumnSelect";
import IntegerSlider from "../../processSelect/integerSlider";
import DecimalSlider from "../../processSelect/decimalSlider";

const DBScanForm = ({ setValues, setWorkspaceTypeDetails }) => {
  const [learnigColumns, setLearningColumns] = useState();
  const [label, setLabel] = useState();
  const [eps, setEps] = useState(0.2);
  const [minSamples, setMinSamples] = useState(5);
  const [leafSize, setLeafSize] = useState(30);

  const onFinish = (values) => {
    values.columns = learnigColumns;
    values.target_column = label;
    values.eps = eps;
    values.min_samples = minSamples;
    values.leafSize = leafSize;

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
      <Form.Item
        name="eps"
        label="Eps Values"
        wrapperCol={{ offset: 0, span: 8 }}
      >
        <DecimalSlider
          setValue={setEps}
          maxInput={1}
          maxSlider={1}
          defaultVal={0.5}
        />
      </Form.Item>
      <Form.Item
        name="leaf_size"
        label="Leaf Size"
        wrapperCol={{ offset: 0, span: 8 }}
      >
        <IntegerSlider
          setValue={setLeafSize}
          maxInput={100}
          maxSlider={100}
          defaultVal={30}
        />
      </Form.Item>
      <Form.Item
        name="min_samples"
        label="Minimum Samples"
        wrapperCol={{ offset: 0, span: 8 }}
      >
        <IntegerSlider
          setValue={setMinSamples}
          maxInput={20}
          maxSlider={100}
          defaultVal={5}
        />
      </Form.Item>
      <Form.Item label="Algorithm" wrapperCol={{ offset: 0, span: 8 }}>
        <Select
          placeholder={"auto"}
          disabled={true}
          className="select-column-width"
        ></Select>
      </Form.Item>
      <Form.Item label="Metric" wrapperCol={{ offset: 0, span: 8 }}>
        <Select
          placeholder={"euclidian"}
          disabled={true}
          className="select-column-width"
        ></Select>
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
