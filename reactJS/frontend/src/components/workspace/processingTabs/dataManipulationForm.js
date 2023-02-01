import { Button, Checkbox, Form, Input, Radio } from "antd";
import React, { useState } from "react";

const DataManipulationForm = ({ setValues }) => {
  const [missingValueEnabled, setMissingValueEnabled] = useState(false);
  const [dropColumnEnabled, setDropColumnEnabled] = useState(false);
  const [dropRowEnabled, setDropRowEnabled] = useState(false);

  const onFinish = (values) => {
    if (!missingValueEnabled) {
      values.fillMissingValues = undefined;
    }
    if (!dropColumnEnabled) {
      values.dropColumn = undefined;
    }
    if (!dropRowEnabled) {
      values.dropRow = undefined;
    }
    setValues(values);
  };

  return (
    <>
      <Form
        name="basic"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="form-center"
      >
        <Checkbox
          checked={missingValueEnabled}
          onChange={(e) => setMissingValueEnabled(e.target.checked)}
        >
          Fill Missing Values
        </Checkbox>
        {missingValueEnabled && (
          <Form.Item
            name="fillMissingValues"
            label="With"
            disabled={!missingValueEnabled}
          >
            <Radio.Group disabled={!missingValueEnabled}>
              <Radio value="1">Mean Value</Radio>
              <Radio value="2">Specific Value</Radio>
              <Radio value="3">item 3</Radio>
            </Radio.Group>
          </Form.Item>
        )}

        <Checkbox
          checked={dropColumnEnabled}
          onChange={(e) => setDropColumnEnabled(e.target.checked)}
        >
          Drop Column
        </Checkbox>
        <Form.Item
          name="dropColumn"
          label="Column Name"
          wrapperCol={{ offset: 0, span: 3 }}
        >
          <Input disabled={!dropColumnEnabled} />
        </Form.Item>
        <Checkbox
          checked={dropRowEnabled}
          onChange={(e) => setDropRowEnabled(e.target.checked)}
        >
          Drop Row
        </Checkbox>
        <Form.Item
          name="dropRow"
          label="Row Name"
          wrapperCol={{ offset: 0, span: 3 }}
        >
          <Input disabled={!dropRowEnabled} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="form-button-color"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DataManipulationForm;
