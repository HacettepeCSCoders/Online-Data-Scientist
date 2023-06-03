import { Button, Checkbox, Form, Popover } from "antd";
import { InfoOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { infoModalStatisticalTest } from "../../../utils/workspace/infoModalStatisticalTest";
import DropColumnSelect from "./processSelect/dropColumnSelect";

const StatisticalProcessingForm = () => {
  const [shapiroWilkTestEnabled, setShapiroWilkTestEnabled] = useState(false);
  const [shapiroColumn, setShapiroColumn] = useState("");
  const onFinish = (values) => {
    values.shapiro_wilk_test = shapiroColumn;
    console.log(values);
  };
  return (
    <>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        className="form-center"
      >
        <Popover content={infoModalStatisticalTest[0].element}>
          <InfoOutlined />
        </Popover>
        <Checkbox
          checked={shapiroWilkTestEnabled}
          onChange={(e) => setShapiroWilkTestEnabled(e.target.checked)}
        >
          Shapiro Wilk Test
        </Checkbox>
        {shapiroWilkTestEnabled && (
          <Form.Item
            name="shapiro_wilk_test"
            label="With Column"
            wrapperCol={{ offset: 0, span: 3 }}
          >
            <DropColumnSelect
              disabledDropColumn={!shapiroWilkTestEnabled}
              columnArray={shapiroColumn}
              setColumnArray={setShapiroColumn}
              colNameOrId={"name"}
              mode={null}
            />
          </Form.Item>
        )}
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

export default StatisticalProcessingForm;
