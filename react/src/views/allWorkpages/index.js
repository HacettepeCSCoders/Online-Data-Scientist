import React, { useEffect, useState } from "react";
import { Avatar, List, Layout, Skeleton, Descriptions, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import {
  getAllWorkspaces,
  deleteWorkspace,
} from "../../services/workspaceService";
import { dummyAllWorkspaces } from "../../utils/dummyData"; // dummyData
import { useNavigate } from "react-router-dom";
const { Content } = Layout;

const AllWorkspaces = () => {
  const [allWorkspaces, setAllWorkspaces] = useState();
  let navigate = useNavigate();

  const onClickPlus = () => {
    const workspaceId = Date.now();
    navigate(`/workspace/${workspaceId}/new`);
  };

  const onClickDelete = (workspaceId) => {
    console.log(workspaceId);
    deleteWorkspace(workspaceId);
  };

  const onClickAddColab = () => {};

  useEffect(() => {
    // const getAll = async () => {
    //   try {
    //     const response = await getAllWorkspaces();
    //     console.log(response);
    //     setAllWorkspaces(response.data);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };
    // getAll();

    setAllWorkspaces(dummyAllWorkspaces); // dummy code
  }, []);
  return (
    <>
      <PageHeader
        className="pageHeader-workspace"
        title="Your Workspaces"
        onBack={() => {
          navigate("/", { replace: true });
        }}
        subTitle="see all workspaces , delete or add colab "
      >
        <Button onClick={onClickPlus} className="button-allWorkspace">
          + New Workspace
        </Button>
      </PageHeader>
      <Content className="content-nav">
        {allWorkspaces ? (
          <List
            className="list-allworkspace"
            itemLayout="horizontal"
            dataSource={allWorkspaces || []}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <a className="nav-color" onClick={onClickAddColab}>
                    Add Colab
                  </a>,
                  <a
                    onClick={() => {
                      onClickDelete(item.workspaceId);
                    }}
                    className="red-color"
                  >
                    Delete
                  </a>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://joesch.moe/api/v1/random?key=${index}`} // change this find good avatar for workspaces
                    />
                  }
                  title={
                    <a
                      onClick={() => {
                        navigate(`/workspace/${item.workspaceId}`);
                      }}
                    >
                      {item.fileName}
                    </a>
                  }
                  description={<div>{item.workspaceId}</div>}
                />
                <div> {item.createdDate}</div>
              </List.Item>
            )}
          />
        ) : (
          <Skeleton active />
        )}
      </Content>
    </>
  );
};

export default AllWorkspaces;
