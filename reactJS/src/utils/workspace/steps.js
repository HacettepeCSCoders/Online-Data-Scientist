import React from "react";
import UploadFile from "../../components/workspace/uploadFile";
import VisualizeData from "../../components/workspace/visualizeData";
import SelectProcessing from "../../components/workspace/selectProcessing";
import StartProcessing from "../../components/workspace/startProcessing";
import WelcomeWorkspace from "../../components/workspace/welcomeWorkspace";

export const steps = [
  {
    title: "Welcome to Workspace",
    content: <WelcomeWorkspace />,
  },
  {
    title: "Upload CSV or Excel File",
    content: <UploadFile />,
  },
  {
    title: "Visualize Data",
    content: <VisualizeData />,
  },
  {
    title: "Select Processing",
    content: <SelectProcessing />,
  },
  {
    title: "Start Processing",
    content: <StartProcessing />,
  },
];
