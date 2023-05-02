import { Button, Checkbox, Form, Input, Radio } from "antd";
import React, { useState } from "react";

const DataManipulationForm = ({ setValues }) => {
  const [missingValueEnabled, setMissingValueEnabled] = useState(false);
  const [dropColumnEnabled, setDropColumnEnabled] = useState(false);
  const [dropRowEnabled, setDropRowEnabled] = useState(false);

  const onFinish = (values) => {
    if (!missingValueEnabled) {
      values.fill_missing_strategy = undefined;
    }
    if (!dropColumnEnabled) {
      values.to_drop_columns = undefined;
    }
    if (!dropRowEnabled) {
      values.to_drop_rows = undefined;
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
        <br />
        {missingValueEnabled && (
          <Form.Item
            name="fill_missing_strategy"
            label="With"
            disabled={!missingValueEnabled}
          >
            <Radio.Group disabled={!missingValueEnabled}>
              <Radio value="mean">Mean Value</Radio>
              <Radio value="median">Median Value</Radio>
              <Radio value="max">Max Value</Radio>
              <Radio value="min">Min Value</Radio>
              <Radio value="zero">Zero Value</Radio>
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
          name="to_drop_columns"
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
          name="to_drop_rows"
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
