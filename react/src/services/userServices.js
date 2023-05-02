import axios from "axios";

export const getAllUsers = () => {
  return axios({
    method: "get",
    url: "http://localhost:8080/api/v1/users", // change this url
  });
};

export const deleteUser = (userId) => {
  return axios({
    method: "post",
    url: `http://localhost:8080/api/v1/users/deactivate/${1}`,
  });
};
