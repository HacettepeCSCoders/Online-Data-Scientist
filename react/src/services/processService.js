import axios from "axios";

export const startProcess = async (dataAndProcess) => {
  // return axios({
  //   method: "post",
  //   url: `http://localhost:8000/insert`,
  //   data: dataAndProcess,
  //   mode: "cors",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/octet-stream",
  //   },
  // });

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
