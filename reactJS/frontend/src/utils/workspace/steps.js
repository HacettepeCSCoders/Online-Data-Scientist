import React from "react";
import UploadFile from "../../components/workspace/uploadFile";
import VisualizeData from "../../components/workspace/visualizeData";

export const steps = [
  {
    title: "Upload CSV or Excel File",
    content: <UploadFile />,
  },
  {
    title: "Visualize Data",
    content: <VisualizeData />,
  },
  {
    title: "Last",
    content: "Last-content",
  },
];
