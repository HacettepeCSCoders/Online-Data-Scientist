import React from "react";
import getRowIds from "../../../../utils/workspace/getRowIds";
import { useData } from "../../../../hocs/dataProvider";
import { Select, Space } from "antd";
const { Option } = Select;

const DropRowSelect = ({ disabledDropRow, setRowArray }) => {
  const { dataDetails } = useData();
  const rowArr = getRowIds(dataDetails);

  const handleChange = (value) => {
    setRowArray(value);
  };

  return (
    <>
      <Select
        mode="multiple"
        style={{
          width: "100%",
        }}
        placeholder="select rows"
        onChange={handleChange}
        disabled={disabledDropRow}
        className="select-column-width"
      >
        {rowArr.map((row) => {
          return (
            <Option value={row} label={row}>
              <Space>{row}</Space>
            </Option>
          );
        })}
      </Select>
    </>
  );
};

export default DropRowSelect;
