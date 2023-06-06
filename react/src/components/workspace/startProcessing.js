import React, { Suspense, useEffect, useState } from "react";
import { Col, Layout, List, Row, Skeleton, Tabs } from "antd";
import { useProcessing } from "../../hocs/proccesingProvider";
import { useData } from "../../hocs/dataProvider";
import DataTable from "./dataTable/dataTable";
import getColumnsStruct from "../../utils/workspace/getColumnsStruct";
import SelectedProcesses from "./modal/resultModalTabs/selectedProcesses";
import DataTab from "./modal/resultModalTabs/dataTab";
import { useWorkspaceType } from "../../hocs/workspaceTypeProvider";

const { Content } = Layout;

const StartProcessing = () => {
  const { processingDetails } = useProcessing();
  const { workspaceTypeDetails } = useWorkspaceType();
  const { dataDetails } = useData();

  const startTabs = [
    {
      key: 2,
      label: "Selected Processes",
      children: (
        <SelectedProcesses
          dataDetails={dataDetails}
          processingDetails={processingDetails}
          workspaceTypeDetails={workspaceTypeDetails}
        ></SelectedProcesses>
      ),
    },
    {
      key: 1,
      label: "Data",
      children: (
        <Content className="visualize-table csv-table-overflow ">
          <DataTable dataDetails={dataDetails}></DataTable>,
        </Content>
      ),
    },
  ];

  return (
    <>
      <Tabs items={startTabs} />
    </>
  );
};

export default StartProcessing;
