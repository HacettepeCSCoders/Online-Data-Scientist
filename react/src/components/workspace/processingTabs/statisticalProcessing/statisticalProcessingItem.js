import React from "react";
import { infoModalStatisticalTest } from "../../../../utils/workspace/infoModalStatisticalTest";
import { Popover, Checkbox, Form } from "antd";
import { InfoOutlined } from "@ant-design/icons";
import DropColumnSelect from "../processSelect/dropColumnSelect";

const StatisticalProcessingItem = ({
  idx,
  checkTestEnabled,
  setCheckTestEnabled,
  column1,
  setColumn1,
  column2,
  setColumn2,
  column3,
  setColumn3,
}) => {
  return (
    <>
      <Popover content={infoModalStatisticalTest[idx].element}>
        <InfoOutlined />
      </Popover>
      <Checkbox
        checked={checkTestEnabled}
        onChange={(e) => setCheckTestEnabled(e.target.checked)}
      >
        {infoModalStatisticalTest[idx].title}
      </Checkbox>
      {checkTestEnabled && (
        <Form.Item
          name={infoModalStatisticalTest[idx].name}
          label="With Column"
          wrapperCol={{ offset: 0, span: 3 }}
        >
          <DropColumnSelect
            disabledDropColumn={!checkTestEnabled}
            columnArray={column1}
            setColumnArray={setColumn1}
            colNameOrId={"name"}
            mode={null}
          />
          {setColumn2 && (
            <DropColumnSelect
              disabledDropColumn={!checkTestEnabled}
              columnArray={column2}
              setColumnArray={setColumn2}
              colNameOrId={"name"}
              mode={null}
            />
          )}
          {setColumn3 && (
            <DropColumnSelect
              disabledDropColumn={!checkTestEnabled}
              columnArray={column3}
              setColumnArray={setColumn3}
              colNameOrId={"name"}
              mode={null}
            />
          )}
        </Form.Item>
      )}
      <br />
    </>
  );
};

export default StatisticalProcessingItem;
