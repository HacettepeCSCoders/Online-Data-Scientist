import React, { useEffect, useState } from "react";
import {
  Layout,
  Skeleton,
  Button,
  Table,
  Descriptions,
  Space,
  Typography,
} from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import {
  getAllWorkspaces,
  removeWorkspace,
} from "../../services/workspaceService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;
const { Content } = Layout;

const AllWorkspaces = () => {
  const [allWorkspaces, setAllWorkspaces] = useState();
  let navigate = useNavigate();

  const { userId } = useSelector((store) => ({
    userId: store.id,
  }));

  const onClickPlus = () => {
    const workspaceId = Date.now();
    navigate(`/workspace/${workspaceId}/new`);
  };

  const onClickDelete = async (workspaceId) => {
    try {
      await removeWorkspace(workspaceId);
    } catch {
      console.error();
    }
    const getAll = async () => {
      try {
        const response = await getAllWorkspaces(userId);
        let arr = [];
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].active !== false) {
            arr.push(response.data[i]);
          }
        }
        setAllWorkspaces(arr);
      } catch (e) {
        console.log(e);
      }
    };
    getAll();
  };

  const onClickGoToWorkspace = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
  };

  useEffect(() => {
    const getAllFirst = async () => {
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
    getAllFirst();
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
