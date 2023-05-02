import React, { Suspense } from "react";
import { useData } from "../../hocs/dataProvider";
import { Layout, Skeleton } from "antd";
import DataTable from "./dataTable/dataTable";

const { Content } = Layout;

const VisualizeData = () => {
  const { dataDetails } = useData();

  return (
    <>
      <Suspense fallback={<Skeleton active />}>
        {dataDetails && (
          <Content className="visualize-table csv-table-overflow ">
            <DataTable dataDetails={dataDetails}></DataTable>
          </Content>
        )}
        {dataDetails === undefined && (
          <div>
            You don't upload any data. Please return and upload CSV or Excel
            file.
          </div>
        )}
      </Suspense>
    </>
  );
};
export default VisualizeData;
