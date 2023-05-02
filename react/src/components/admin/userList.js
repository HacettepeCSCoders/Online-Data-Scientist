import React, { useEffect, useState } from "react";
import { Avatar, List, Layout, Skeleton } from "antd";
import { deleteUser, getAllUsers } from "../../services/userServices";
const { Content } = Layout;

const UserList = () => {
  const [userList, setUserList] = useState();

  useEffect(() => {
    const getAll = async () => {
      try {
        const response = await getAllUsers();
        console.log(response);
        setUserList(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    getAll();
  }, []);

  const onClickDelete = (userId) => {
    deleteUser(userId);
  };

  return (
    <>
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
                      onClickDelete(item.userId);
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
