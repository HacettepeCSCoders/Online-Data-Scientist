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

export const getTable = async () => {
  return axios({
    method: "get",
    url: `/python/get-table`,
  });
};
