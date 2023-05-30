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

  return fetch("http://localhost:8000/insert", {
    method: "POST",
    body: dataAndProcess,
  });
};

export const getTable = async () => {
  return axios({
    method: "get",
    url: `http://localhost:8000/get-table`,
  });
};
