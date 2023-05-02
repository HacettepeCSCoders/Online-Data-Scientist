import axios from "axios";

export const getAllUsers = () => {
  return axios({
    method: "get",
    url: "http://localhost:8080/api/v1/users", // change this url
  });
};
