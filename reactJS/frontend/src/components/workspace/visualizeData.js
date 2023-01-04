import React, { Suspense, useEffect } from "react";
import { useData } from "../../hocs/dataProvider";
import { CsvToHtmlTable } from "react-csv-to-table";
import { Layout, Skeleton } from "antd";
const { Content } = Layout;

const VisualizeData = () => {
  const { dataDetails, setDataDetails } = useData();

  // Instead of using ready-made components, we can create a table ourselves.

  // useEffect(() => {
  //   const rows = dataDetails.split("\n");
  //   let cols = rows.slice(0, 1)[0];
  //   cols = cols.split(",");

  //   console.log(cols);
  // }, []);

  // const rowSplit = () => {};

  return (
    <>
      <Suspense fallback={<Skeleton active />}>
        {dataDetails && (
          <Content className="workspace-table-content csv-table-overflow ">
            <CsvToHtmlTable
              tableRowClassName="csv-table-row-back"
              data={dataDetails}
              csvDelimiter=","
            />
          </Content>
        )}
      </Suspense>
    </>
  );
};
export default VisualizeData;
