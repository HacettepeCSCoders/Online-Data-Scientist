import axios from "axios";

export const getAllWorkspaces = (userId) => {};

export const createWorkspace = (creds) => {
  console.log(creds);
};

export const deleteWorkspace = (workspaceId) => {};

export const getWorkspace = (userId, workspaceId) => {
  return axios({
    method: "get",
    url: `http://localhost:8080/api/v1/users/${3}`,
  });
};
