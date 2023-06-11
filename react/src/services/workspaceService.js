import axios from "axios";

export const getAllWorkspaces = (userId) => {
  return axios({
    method: "get",
    url: `/api/v1/users/${userId}/workspaces`,
  });
};

export const createWorkspace = (creds, userId) => {
  return axios({
    method: "post",
    url: `http://localhost:8080/api/v1/users/${userId}/workspaces`,
    data: creds,
  });
};

export const removeWorkspace = (workspaceId) => {
  return axios({
    method: "post",
    url: `http://localhost:8080/api/v1/workspaces/deactivate/${workspaceId}`,
  });
};

export const getWorkspace = (workspaceId) => {
  return axios({
    method: "get",
    url: `http://localhost:8080/api/v1/workspaces/${workspaceId}`,
  });
};
