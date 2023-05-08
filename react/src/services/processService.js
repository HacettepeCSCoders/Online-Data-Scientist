import axios from "axios";

export const startProcess = async (dataAndProcess) => {
  try {
    const response = axios({
      method: "POST",
      // url: `http://localhost:8000/insert`,
      url: "http://localhost:8080/api/v1/auth/login",
      data: dataAndProcess,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/octet-stream",
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
