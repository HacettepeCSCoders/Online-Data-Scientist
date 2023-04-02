import axios from "axios";

export const getAllUsers = () => {
  return axios({
    method: "get",
    url: "http://localhost:8080/api/v1/users", // not correct must be write correct API
  });
};
