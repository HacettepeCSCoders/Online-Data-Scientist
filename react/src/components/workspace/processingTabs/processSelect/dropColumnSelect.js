import React, { useState } from "react";
import { Select, Space } from "antd";
import { useData } from "../../../../hocs/dataProvider";
import getColumnsStruct from "../../../../utils/workspace/getColumnsStruct";
const { Option } = Select;

const DropColumnSelect = ({ disabledDropColumn, setColumnArray }) => {
  const { dataDetails } = useData();
  const colArr = getColumnsStruct(dataDetails);

  const handleChange = (value) => {
    setColumnArray(value);
  };
  return (
    <>
      <Select
        mode="multiple"
        style={{
          width: "100%",
        }}
        placeholder="select columns"
        onChange={handleChange}
        disabled={disabledDropColumn}
      >
        {colArr &&
          colArr.map((col) => {
            return (
              <Option value={col.id} label={col.name}>
                <Space>{col.name}</Space>
              </Option>
            );
          })}
      </Select>
    </>
  );
};

export default DropColumnSelect;
