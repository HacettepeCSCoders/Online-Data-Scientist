import React, { Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout, Skeleton } from "antd";
import { DataProvider } from "../../hocs/dataProvider";
import { ProcessingProvider } from "../../hocs/proccesingProvider";
import { WorkspaceTypeProvider } from "../../hocs/workspaceTypeProvider";
import { FileNameProvider } from "../../hocs/fileNameProvider";
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
          <FileNameProvider>
            <DataProvider>
              <ProcessingProvider>
                <Layout className="layout-background">
                  <WorkspaceSteps workspaceId={pathId} />
                </Layout>
              </ProcessingProvider>
            </DataProvider>
          </FileNameProvider>
        </WorkspaceTypeProvider>
      </Suspense>
    </>
  );
};
export default Workspace;
