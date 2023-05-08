import axios from "axios";

export const getAllWorkspaces = (userId) => {
  return axios({
    method: "get",
    url: `http://localhost:8080/api/v1/users/${userId}/workspaces`,
  });
};

export const createWorkspace = (creds, userId) => {
  console.log(creds);
  return axios({
    method: "post",
    url: `http://localhost:8080/api/v1/users/${userId}/workspaces`,
    data: creds,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  });
};

export const deleteWorkspace = (workspaceId) => {};

export const getWorkspace = (userId, workspaceId) => {
  return axios({
    method: "get",
    url: `http://localhost:8080/api/v1/users/${3}`,
  });
};
