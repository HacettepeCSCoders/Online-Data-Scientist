import axios from "axios";

export const startProcess = async (dataAndProcess) => {
  return axios({
    method: "post",
    url: `http://localhost:8080/api/v1/auth/login`,
    data: dataAndProcess,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/octet-stream",
    },
  });
};
