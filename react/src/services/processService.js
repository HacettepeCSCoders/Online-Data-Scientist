import axios from "axios";

export const startProcess = async (dataAndProcess) => {
  try {
    const response = await axios({
      method: "post",
      url: "http://localhost:8080/api/v1/auth/login", // not correct must be write correct API
      data: dataAndProcess,
      config: { headers: { "Content-Type": "multipart/form-data" } },
    });
    console.log(response);
    return response;
  } catch (e) {
    console.log(e);
  }
};
