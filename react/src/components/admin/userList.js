import React, { useEffect, useState } from "react";
import { Avatar, List, Layout, Skeleton, message, Button } from "antd";
import { deleteUser, getAllUsers } from "../../services/userServices";
const { Content } = Layout;

const UserList = () => {
  const [userList, setUserList] = useState();
  const [deleteMessageApi, deleteMessageApiContext] = message.useMessage();

  const getAll = async () => {
    try {
      const response = await getAllUsers();
      setUserList(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteMesage = (username) => {
    deleteMessageApi.open({
      type: "info",
      content: (
        <>
          Do you really want to delete?
          <div>
            <Button
              onClick={() => {
                try {
                  deleteUser(username);
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

  useEffect(() => {
    getAll();
  }, []);

  const onClickDelete = (username) => {
    deleteMesage(username);
  };

  return (
    <>
      {deleteMessageApiContext}

      <Content className="content-nav">
        {userList ? (
          <List
            className="list-allworkspace"
            itemLayout="horizontal"
            dataSource={userList || []}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <a
                    onClick={() => {
                      onClickDelete(item.username);
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
                      src={`https://joesch.moe/api/v1/random?key=${index}`}
                    />
                  }
                  title={item.username}
                />
                <div></div>
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

export default UserList;
