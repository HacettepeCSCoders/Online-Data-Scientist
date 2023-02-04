import { render } from "@testing-library/react";
import { Button, Table } from "antd";
import React from "react";

const DataTable = ({ dataDetails }) => {
  const rows = dataDetails.split("\n");
  let cols = rows.splice(0, 1)[0];
  cols = cols.split(",");

  const columns = cols.map((col, idx) => {
    const res = {
      title: col,
      dataIndex: col,
      key: idx,
    };
    return res;
  });

  let count = -1;
  const result = rows.map((row) => {
    const vals = row.split(",");
    count++;
    return vals.reduce((res, val, idx) => {
      const prop = cols[idx];
      res[prop] = val;
      return res;
    }, {});
  });
  return (
    <>
      <Table dataSource={result} columns={columns}></Table>
    </>
  );
};

export default DataTable;
