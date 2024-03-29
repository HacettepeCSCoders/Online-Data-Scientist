import { Button, Checkbox, Form, Input, Radio } from "antd";
import React, { useState } from "react";
import DropColumnSelect from "./processSelect/dropColumnSelect";
import DropRowSelect from "./processSelect/dropRowSelect";

const DataManipulationForm = ({ setValues, setWorkspaceTypeDetails }) => {
  const [missingValueEnabled, setMissingValueEnabled] = useState(false);
  const [dropColumnEnabled, setDropColumnEnabled] = useState(false);
  const [dropRowEnabled, setDropRowEnabled] = useState(false);
  const [nonNumColEnabled, setNonNumColEnabled] = useState(false);
  const [columnArray, setColumnArray] = useState([]);
  const [nonNumColArray, setNonNumColArray] = useState([]);
  const [rowsArray, setRowsArray] = useState();

  const onFinish = (values) => {
    !missingValueEnabled && (values.fill_missing_strategy = undefined);
    !dropColumnEnabled
      ? (values.to_drop_columns = undefined)
      : columnArray.length !== 0
      ? (values.to_drop_columns = columnArray)
      : (values.to_drop_columns = undefined);
    !nonNumColEnabled
      ? (values.non_num_cols = undefined)
      : nonNumColArray.length !== 0
      ? (values.non_num_cols = nonNumColArray)
      : (values.non_num_cols = undefined);
    !dropRowEnabled
      ? (values.to_drop_rows = undefined)
      : rowsArray.length !== 0
      ? (values.to_drop_rows = rowsArray)
      : (values.to_drop_rows = undefined);

    setValues(values);
    setWorkspaceTypeDetails("dataManipulation");
    console.log(values);
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
          label="Select Columns"
          wrapperCol={{ offset: 0, span: 3 }}
        >
          <DropColumnSelect
            disabledDropColumn={!dropColumnEnabled}
            columnArray={columnArray}
            setColumnArray={setColumnArray}
            colNameOrId={"id"}
            mode="multiple"
          />
        </Form.Item>
        <Checkbox
          checked={dropRowEnabled}
          onChange={(e) => setDropRowEnabled(e.target.checked)}
        >
          Drop Row
        </Checkbox>
        <Form.Item
          name="to_drop_rows"
          label="Select Rows"
          wrapperCol={{ offset: 0, span: 3 }}
        >
          <DropRowSelect
            disabledDropRow={!dropRowEnabled}
            setRowArray={setRowsArray}
          />
        </Form.Item>
        <Checkbox
          checked={nonNumColEnabled}
          onChange={(e) => setNonNumColEnabled(e.target.checked)}
        >
          Non-Numeric Columns
        </Checkbox>
        <Form.Item
          name="non_num_cols"
          label="Convert to Numerical Values"
          wrapperCol={{ offset: 0, span: 3 }}
        >
          <DropColumnSelect
            disabledDropColumn={!nonNumColEnabled}
            columnArray={nonNumColArray}
            setColumnArray={setNonNumColArray}
            colNameOrId={"name"}
            mode="multiple"
          />
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
