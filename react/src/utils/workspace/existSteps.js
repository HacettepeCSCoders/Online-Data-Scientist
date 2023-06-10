import React from "react";
import VisualizeData from "../../components/workspace/visualizeData";
import SelectProcessing from "../../components/workspace/selectProcessing";
import StartProcessing from "../../components/workspace/startProcessing";

export const existSteps = [
  {
    title: "Visualize Data",
    content: <VisualizeData />,
    subTitle: "",
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
