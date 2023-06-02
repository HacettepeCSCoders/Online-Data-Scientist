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
    subTitle:
      "After this stage, we will help you make the best use of the data wehave. First of all, please select the field for which you will use the data you have.",
  },
  {
    title: "Upload CSV or Excel File",
    content: <UploadFile />,
    subTitle: "Upload the file you want to process",
  },
  {
    title: "Visualize Data",
    content: <VisualizeData />,
  },
  {
    title: "Select Processing",
    content: <SelectProcessing newWorkspace={true} />,
  },
  {
    title: "Start Processing",
    content: <StartProcessing />,
    subTitle:
      "Check the selected data and processings. If the informations is correct, start processing.",
  },
];
