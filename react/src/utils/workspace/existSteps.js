import React from "react";
import VisualizeData from "../../components/workspace/visualizeData";
import SelectProcessing from "../../components/workspace/selectProcessing";
import StartProcessing from "../../components/workspace/startProcessing";
import WelcomeWorkspace from "../../components/workspace/welcomeWorkspace";

export const existSteps = [
  {
    title: "Visualize Data",
    content: <VisualizeData />,
    subTitle: "",
  },
  {
    title: "Select Workspace Type",
    content: <WelcomeWorkspace />,
    subTitle:
      "After this stage, we will help you make the best use of the data we have. First of all, please select the field for which you will use the data you have.",
  },
  {
    title: "Select Processing",
    content: <SelectProcessing newWorkspace={false} />,
    subTitle: "",
  },
  {
    title: "Start Processing",
    content: <StartProcessing />,
    subTitle:
      "Check the selected data and processings. If the informations is correct, start processing.",
  },
];
