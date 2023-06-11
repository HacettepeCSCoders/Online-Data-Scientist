import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Descriptions, Tabs, Tag } from "antd";
import ReportTab from "./resultPageTabs/reportTab";
import VisualizeTab from "./resultPageTabs/visualizeTab";
import PredictTabs from "./resultPageTabs/predictTabs";

const ResultTab = ({ result, workspaceTypeDetails }) => {
  let resultTabs = [];
  if (
    workspaceTypeDetails !== "statistical" &&
    workspaceTypeDetails !== "dataManipulation"
  ) {
    resultTabs = [
      {
        key: 1,
        label: "Report",
        children: (
          <ReportTab
            result={result}
            workspaceTypeDetails={workspaceTypeDetails}
          />
        ),
      },
      {
        key: 2,
        label: "Visualize",
        children: (
          <VisualizeTab
            result={result}
            workspaceTypeDetails={workspaceTypeDetails}
          />
        ),
      },
      {
        key: 3,
        label: "Predicted",
        children: (
          <PredictTabs
            result={result}
            workspaceTypeDetails={workspaceTypeDetails}
          />
        ),
      },
    ];
  } else {
    resultTabs = [
      {
        key: 1,
        label: "Report",
        children: (
          <ReportTab
            result={result}
            workspaceTypeDetails={workspaceTypeDetails}
          />
        ),
      },
    ];
  }

  return (
    <>
      <Tabs defaultActiveKey="1" type="card" items={resultTabs}></Tabs>
    </>
  );
};

export default ResultTab;
