import React, { useEffect, useState } from "react";
import {
  Layout,
  Skeleton,
  Button,
  Table,
  Descriptions,
  Space,
  Typography,
  message,
} from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import {
  getAllWorkspaces,
  removeWorkspace,
} from "../../services/workspaceService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteWorkspace } from "../../services/processService";
const { Text } = Typography;
const { Content } = Layout;

const AllWorkspaces = () => {
  const [allWorkspaces, setAllWorkspaces] = useState();
  const [deleteMessageApi, deleteMessageApiContext] = message.useMessage();
  let navigate = useNavigate();

  const getAll = async () => {
    try {
      const response = await getAllWorkspaces(userId);
      let arr = [];
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].active !== false) {
          arr.push(response.data[i]);
        }
      }

      for (let i = 0; i < arr.length; i++) {
        arr[i].updateDate = new Date(arr[i].updateDate);
        arr[i].createDate = new Date(arr[i].createDate);
      }
      arr.sort(function (a, b) {
        return new Date(b.updateDate) - new Date(a.updateDate);
      });
      setAllWorkspaces(arr);
    } catch (e) {
      console.log(e);
    }
  };

  const { userId } = useSelector((store) => ({
    userId: store.id,
  }));

  const onClickPlus = () => {
    const workspaceId = Date.now();
    navigate(`/workspace/${workspaceId}/new`);
  };

  const deleteMesage = (workspaceId) => {
    deleteMessageApi.open({
      type: "info",
      content: (
        <>
          Do you really want to delete?
          <div>
            <Button
              onClick={() => {
                try {
                  removeWorkspace(workspaceId);
                  deleteWorkspace(userId, workspaceId);
                  window.location.reload(false);
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              Yes
            </Button>
            <Button>No</Button>
          </div>
        </>
      ),
      duration: 1.25,
    });
  };

  const onClickDelete = async (workspaceId) => {
    deleteMesage(workspaceId);
  };

  const onClickGoToWorkspace = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
  };

  useEffect(() => {
    getAll();
  }, []);

  const columns = [
    {
      title: "",
      dataIndex: "goToWork",
      key: "action1",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              onClickGoToWorkspace(record.id);
            }}
          >
            Go to Workspace
          </Button>
        </Space>
      ),
    },
    {
      title: "Workspace Id",
      dataIndex: "id",
      render: (text) => <Text keyboard> {text}</Text>,
    },
    {
      title: "File Name",
      dataIndex: "fileName",
      render: (text) => <Text keyboard> {text}</Text>,
    },
    {
      title: "",
      dataIndex: "delete",
      key: "action2",
      render: (_, record) => (
        <Space>
          <Button
            className="red-color"
            onClick={() => {
              onClickDelete(record.id);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {deleteMessageApiContext}
      <PageHeader
        className="pageHeader-workspace"
        title="Your Workspaces"
        onBack={() => {
          navigate("/", { replace: true });
        }}
        subTitle="You can view and delete workspaces on this page."
      >
        <Button onClick={onClickPlus} className="button-allWorkspace">
          + New Workspace
        </Button>
      </PageHeader>
      <Content className="content-nav">
        {allWorkspaces ? (
          <>
            <Table
              columns={columns}
              dataSource={allWorkspaces}
              rowKey={"id"}
              expandable={{
                expandedRowRender: (a) => {
                  return (
                    <Descriptions bordered>
                      <Descriptions.Item label="Create Date">
                        {a.createDate.toUTCString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="Update Date">
                        {a.updateDate.toUTCString()}
                      </Descriptions.Item>
                    </Descriptions>
                  );
                },
              }}
            ></Table>
          </>
        ) : (
          <Skeleton active />
        )}
      </Content>
    </>
  );
};

export default AllWorkspaces;
