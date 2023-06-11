import axios from "axios";

export const startProcess = async (dataAndProcess) => {
  return fetch("http://localhost:8000/python/insert", {
    method: "POST",
    body: dataAndProcess,
  });
};

export const getTable = async (user_id, workspace_id) => {
  return axios({
    method: "GET",
    url: `http://localhost:8000/python/get-table?user_id=${user_id}&workspace_id=${workspace_id}`,
  });
};

export const makeTest = async (data) => {
  return axios({
    method: "POST",
    url: `http://localhost:8000/python/make-tests`,
    data: data,
  });
};

export const manipulate = async (data) => {
  return axios({
    method: "POST",
    url: `http://localhost:8000/python/manipulate`,
    data: data,
  });
};

export const deleteWorkspace = async (user_id, workspace_id) => {
  return axios({
    method: "DELETE",
    url: `http://localhost:8000/python/delete-workspace?user_id=${user_id}&workspace_id=${workspace_id}`,
  });
};

export const knnTest = async (body) => {
  return axios({
    method: "POST",
    url: `http://localhost:8000/python/classification/knn`,
    data: body,
  });
};
