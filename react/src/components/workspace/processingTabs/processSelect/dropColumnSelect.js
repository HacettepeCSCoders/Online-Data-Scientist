import React from "react";
import { Select, Space } from "antd";
import { useData } from "../../../../hocs/dataProvider";
import getColumnsStruct from "../../../../utils/workspace/getColumnsStruct";
const { Option } = Select;

const DropColumnSelect = ({
  disabledDropColumn,
  setColumnArray,
  colNameOrId,
  mode,
}) => {
  const { dataDetails } = useData();
  const colArr = getColumnsStruct(dataDetails);

  const handleChange = (value) => {
    setColumnArray(value);
  };
  return (
    <>
      <Select
        mode={mode}
        style={{
          width: "100%",
        }}
        placeholder="select columns"
        onChange={handleChange}
        disabled={disabledDropColumn}
        className="select-column-width"
      >
        {colArr &&
          colArr.map((col) => {
            return (
              <Option
                value={colNameOrId == "name" ? col.name : col.id}
                label={col.name}
              >
                <Space>{col.name}</Space>
              </Option>
            );
          })}
      </Select>
    </>
  );
};

export default DropColumnSelect;
