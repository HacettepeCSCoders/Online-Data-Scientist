import axios from "axios";

export const getAllUsers = () => {
  return axios({
    method: "get",
    url: "/api/v1/users", // change this url
  });
};

export const deleteUser = (username) => {
  return axios({
    method: "post",
    url: `/api/v1/users/deactivateByUsername/${username}`,
  });
};
