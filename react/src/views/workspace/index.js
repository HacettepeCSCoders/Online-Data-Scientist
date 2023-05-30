import React, { Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout, Skeleton } from "antd";
import { DataProvider } from "../../hocs/dataProvider";
import { ProcessingProvider } from "../../hocs/proccesingProvider";
import { WorkspaceTypeProvider } from "../../hocs/workspaceTypeProvider";
import { FileNameProvider } from "../../hocs/fileNameProvider";
import WorkspaceSteps from "../../components/workspace/workspaceSteps";
import { DataFileProvider } from "../../hocs/dataFileProvider";

const Workspace = () => {
  const routeParams = useParams();
  const pathId = routeParams.workspaceId;

  const { userId } = useSelector((store) => ({
    userId: store.id,
  }));

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
            <DataFileProvider>
              <DataProvider>
                <ProcessingProvider>
                  <Layout className="layout-background">
                    <WorkspaceSteps workspaceId={pathId} userId={userId} />
                  </Layout>
                </ProcessingProvider>
              </DataProvider>
            </DataFileProvider>
          </FileNameProvider>
        </WorkspaceTypeProvider>
      </Suspense>
    </>
  );
};
export default Workspace;
