import { Button, Checkbox, Col, Form, Popover, Row } from "antd";
import { InfoOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { infoModalStatisticalTest } from "../../../utils/workspace/infoModalStatisticalTest";
import DropColumnSelect from "./processSelect/dropColumnSelect";

const StatisticalProcessingForm = ({ setValues, setWorkspaceTypeDetails }) => {
  const [shapiroWilkTestEnabled, setShapiroWilkTestEnabled] = useState(false);
  const [shapiroColumn, setShapiroColumn] = useState("");
  const [dagostinoK2TestEnabled, setDagostinoK2TestEnabled] = useState(false);
  const [dagostinoK2Column, setDagostinoK2Column] = useState("");
  const [andersonDarlingTestEnabled, setAndersonDarlingTestEnabled] =
    useState(false);
  const [andersonDarlingColumn, setAndersonDarlingColumn] = useState("");
  useState(false);
  const [pearsonCorrelationTestEnabled, setPearsonCorrelationEnabled] =
    useState(false);
  const [pearsonCorrelationColumn1, setPearsonCorrelationColumn1] =
    useState("");
  const [pearsonCorrelationColumn2, setPearsonCorrelationColumn2] =
    useState("");
  const onFinish = (values) => {
    let test = [];
    !shapiroWilkTestEnabled
      ? (values["shapiro_wilk"] = undefined)
      : (values["shapiro_wilk"] = [shapiroColumn]);
    !dagostinoK2TestEnabled
      ? (values["dagostino_k2"] = undefined)
      : (values["dagostino_k2"] = [dagostinoK2Column]);
    !andersonDarlingTestEnabled
      ? (values["anderson_darling"] = undefined)
      : (values["anderson_darling"] = [andersonDarlingColumn]);
    for (const [key, value] of Object.entries(values)) {
      if (value != undefined) {
        let obj = {};
        obj["test_name"] = key;
        for (let i = 0; i < value.length; i++) {
          obj[`column_${i + 1}`] = value[0];
        }
        test.push(obj);
      }

      console.log(test);
      console.log(key, value);
    }

    setValues(test);
    console.log(values);
    setWorkspaceTypeDetails("statistical");
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
        <Row>
          <Col span={18}>
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
                name="shapiro_wilks"
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
            <br />
            <Popover content={infoModalStatisticalTest[1].element}>
              <InfoOutlined />
            </Popover>
            <Checkbox
              checked={dagostinoK2TestEnabled}
              onChange={(e) => setDagostinoK2TestEnabled(e.target.checked)}
            >
              D'Agostino-Pearson's K²
            </Checkbox>
            {dagostinoK2TestEnabled && (
              <Form.Item
                name="dagostino_k2"
                label="With Column"
                wrapperCol={{ offset: 0, span: 3 }}
              >
                <DropColumnSelect
                  disabledDropColumn={!dagostinoK2TestEnabled}
                  columnArray={dagostinoK2Column}
                  setColumnArray={setDagostinoK2Column}
                  colNameOrId={"name"}
                  mode={null}
                />
              </Form.Item>
            )}
            <br />
            <Popover content={infoModalStatisticalTest[2].element}>
              <InfoOutlined />
            </Popover>
            <Checkbox
              checked={andersonDarlingTestEnabled}
              onChange={(e) => setAndersonDarlingTestEnabled(e.target.checked)}
            >
              Anderson Darling
            </Checkbox>
            {andersonDarlingTestEnabled && (
              <Form.Item
                name="anderson_darling"
                label="With Column"
                wrapperCol={{ offset: 0, span: 3 }}
              >
                <DropColumnSelect
                  disabledDropColumn={!andersonDarlingTestEnabled}
                  columnArray={andersonDarlingColumn}
                  setColumnArray={setAndersonDarlingColumn}
                  colNameOrId={"name"}
                  mode={null}
                />
              </Form.Item>
            )}
          </Col>
          <Col span={18}>
            <Popover content={infoModalStatisticalTest[1].element}>
              <InfoOutlined />
            </Popover>
            <Checkbox
              checked={andersonDarlingTestEnabled}
              onChange={(e) => setAndersonDarlingTestEnabled(e.target.checked)}
            >
              Anderson Darling
            </Checkbox>
            {andersonDarlingTestEnabled && (
              <Form.Item
                name="anderson_darling"
                label="With Column"
                wrapperCol={{ offset: 0, span: 3 }}
              >
                <DropColumnSelect
                  disabledDropColumn={!andersonDarlingTestEnabled}
                  columnArray={andersonDarlingColumn}
                  setColumnArray={setAndersonDarlingColumn}
                  colNameOrId={"name"}
                  mode={null}
                />
              </Form.Item>
            )}
          </Col>
        </Row>

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
