import React, { Suspense, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout, Skeleton } from "antd";
import { DataProvider } from "../../hocs/dataProvider";
import { ProcessingProvider } from "../../hocs/proccesingProvider";
import { WorkspaceTypeProvider } from "../../hocs/workspaceTypeProvider";
import ExistWorkspaceSteps from "../../components/workspace/existWorkspaceSteps";

const ExistWorkspace = () => {
  const routeParams = useParams();
  const pathId = routeParams.workspaceId;
  let navigate = useNavigate();
  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    // if (pathId != 1) {
    //   navigate("/");
    // }
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  return (
    <>
      <Suspense fallback={<Skeleton active />}>
        <WorkspaceTypeProvider>
          <DataProvider>
            <ProcessingProvider>
              <Layout className="layout-background">
                <ExistWorkspaceSteps workspaceId={pathId} />
              </Layout>
            </ProcessingProvider>
          </DataProvider>
        </WorkspaceTypeProvider>
      </Suspense>
    </>
  );
};

export default ExistWorkspace;
