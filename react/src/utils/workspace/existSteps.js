import React from "react";
import VisualizeData from "../../components/workspace/visualizeData";
import SelectProcessing from "../../components/workspace/selectProcessing";
import StartProcessing from "../../components/workspace/startProcessing";
import WelcomeWorkspace from "../../components/workspace/welcomeWorkspace";

export const existSteps = [
  {
    title: "Visualize Data",
    content: <VisualizeData />,
  },
  {
    title: "Welcome to Workspace",
    content: <WelcomeWorkspace />,
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
