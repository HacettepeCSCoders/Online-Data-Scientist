import { Table, Dropdown } from "antd";
import React from "react";
import { PlusOutlined } from "@ant-design/icons";

const DataTable = ({ dataDetails }) => {
  const rows = dataDetails.split("\n");
  let cols = rows.splice(0, 1)[0];
  cols = cols.split(/,|;/);

  rows.pop();

  const columns = cols.map((col, idx) => {
    const res = {
      title: col,
      dataIndex: col,
      key: idx,
    };
    return res;
  });

  const id_column = {
    title: "",
    dataIndex: "id",
    key: 0,
    className: "id-column-background",
  };

  columns.unshift(id_column);
  cols.unshift("id");

  let count = -1;
  const result = rows.map((row) => {
    const vals = row.split(/,|;/);
    count++;
    vals.unshift(count);
    return vals.reduce((res, val, idx) => {
      const prop = cols[idx];
      if (val === "") {
        res[prop] = "<null>";
        return res;
      }
      res[prop] = val;
      return res;
    }, {});
  });

  return (
    <>
      <Table
        rowClassName="render-table"
        dataSource={result}
        columns={columns}
        size={"small"}
      ></Table>
    </>
  );
};

export default DataTable;
