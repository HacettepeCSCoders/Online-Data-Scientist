import React, { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout, Skeleton } from "antd";
import { DataProvider } from "../../hocs/dataProvider";
import { ProcessingProvider } from "../../hocs/proccesingProvider";
import { WorkspaceTypeProvider } from "../../hocs/workspaceTypeProvider";
import ExistWorkspaceSteps from "../../components/workspace/existWorkspaceSteps";
import { getWorkspace } from "../../services/workspaceService";

const ExistWorkspace = () => {
  const routeParams = useParams();
  const [workspace, setWorkspace] = useState([]);
  const pathId = routeParams.workspaceId;
  let navigate = useNavigate();

  const { userId } = useSelector((store) => ({
    userId: store.id,
  }));

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
    // const getAll = async () => {
    //   try {
    //     const response = await getAllUsers();
    //     console.log(response.data.length);
    //     const arr = response.data;
    //     console.log(arr);
    //     setAllWorkspaces(arr);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };
    // getAll();

    const getWork = async () => {
      try {
        const response = await getWorkspace(userId, pathId); // change struct
        console.log(response);
        setWorkspace(response.data);
      } catch (e) {
        console.log(e);
        navigate("/");
      }
    };

    getWork();

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  useEffect(() => {
    // for (let i = 0; i < allWorkspaces.length; i++) {
    //   if (username === allWorkspaces[i].username) {
    //     console.log("a");
    //   }
    // }
    // console.log(allWorkspaces.length);

    if (workspace.userId !== userId) {
      // navigate("/");
    }
  }, [workspace]);

  return (
    <>
      <Suspense fallback={<Skeleton active={true} />}>
        <WorkspaceTypeProvider>
          <DataProvider>
            <ProcessingProvider>
              <Layout className="layout-background">
                <ExistWorkspaceSteps workspaceId={pathId} userId={userId} />
              </Layout>
            </ProcessingProvider>
          </DataProvider>
        </WorkspaceTypeProvider>
      </Suspense>
    </>
  );
};

export default ExistWorkspace;
