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
