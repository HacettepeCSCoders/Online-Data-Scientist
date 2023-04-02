import React, { Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout, Skeleton } from "antd";
import { DataProvider } from "../../hocs/dataProvider";
import { ProcessingProvider } from "../../hocs/proccesingProvider";
import { WorkspaceTypeProvider } from "../../hocs/workspaceTypeProvider";
import { StepProvider } from "../../hocs/stepProvider";
import WorkspaceSteps from "../../components/workspace/workspaceSteps";

const Workspace = () => {
  const routeParams = useParams();
  const pathId = routeParams.workspaceId;

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  return (
    <>
      <Suspense fallback={<Skeleton active />}>
        <WorkspaceTypeProvider>
          <DataProvider>
            <ProcessingProvider>
              <StepProvider>
                <Layout className="layout-background">
                  <WorkspaceSteps workspaceId={pathId} />
                </Layout>
              </StepProvider>
            </ProcessingProvider>
          </DataProvider>
        </WorkspaceTypeProvider>
      </Suspense>
    </>
  );
};
export default Workspace;
