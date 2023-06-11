import axios from "axios";

export const startProcess = async (dataAndProcess) => {
  return fetch("/python/insert", {
    method: "POST",
    body: dataAndProcess,
  });
};

export const getTable = async (user_id, workspace_id) => {
  return axios({
    method: "GET",
    url: `/python/get-table?user_id=${user_id}&workspace_id=${workspace_id}`,
  });
};

export const makeTest = async (data) => {
  return axios({
    method: "POST",
    url: `/python/make-tests`,
    data: data,
  });
};

export const manipulate = async (data) => {
  return axios({
    method: "POST",
    url: `/python/manipulate`,
    data: data,
  });
};

export const deleteWorkspace = async (user_id, workspace_id) => {
  return axios({
    method: "DELETE",
    url: `/python/delete-workspace?user_id=${user_id}&workspace_id=${workspace_id}`,
  });
};
