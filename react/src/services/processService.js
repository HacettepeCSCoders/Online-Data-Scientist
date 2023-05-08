import axios from "axios";

export const startProcess = async (dataAndProcess) => {
  return axios({
    method: "post",
    url: `http://localhost:8000/insert`,
    data: dataAndProcess,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/octet-stream",
    },
  });
};
