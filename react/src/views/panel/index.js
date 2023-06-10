import React from "react";
import UserList from "../../components/admin/userList";
import { PageHeader } from "@ant-design/pro-layout";

const Panel = () => {
  return (
    <>
      <PageHeader
        className="pageHeader-workspace"
        title="User List"
        subTitle="You can view and delete users on this page."
      ></PageHeader>
      <UserList></UserList>
    </>
  );
};

export default Panel;
