import React, { useEffect, useState } from "react";
import { Avatar, List, Layout, Skeleton } from "antd";
import { getAllUsers } from "../../services/userServices";
const { Content } = Layout;

const HomePage = () => {
  const [allUsers, setAllUsers] = useState();

  useEffect(() => {
    const getAll = async () => {
      try {
        const response = await getAllUsers();
        console.log(response);
        setAllUsers(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getAll();
  }, []);
  return (
    <>
      <Content className="content-nav">
        <div> All Users</div>
        {allUsers ? (
          <List
            itemLayout="horizontal"
            dataSource={allUsers || []}
            renderItem={(item, index) => (
              <List.Item>
                {/* <List.Item.Meta
            // avatar={
            //   <Avatar
            //     src={`https://joesch.moe/api/v1/random?key=${index}`}
            //   />
            // }
            // title={<a href="https://ant.design">{item.title}</a>}
            description={<div>{item.username}</div>}
          /> */}
                <div> {item.username}</div>
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

export default HomePage;
