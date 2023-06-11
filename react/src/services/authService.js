import axios from "axios";

export const setAuthorizationHeader = ({ isLoggedIn, access_token }) => {
  if (isLoggedIn) {
    axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;
  } else {
    delete axios.defaults.headers["Authorization"];
  }
};

export const login = async (creds) => {
  try {
    const response = await axios({
      method: "post",
      url: "/api/v1/auth/login",
      data: creds,
      config: { headers: { "Content-Type": "multipart/form-data" } },
    });
    console.log(response);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const signup = async (creds) => {
  try {
    const response = await axios({
      method: "post",
      url: "/api/v1/auth/register",
      data: creds,
      config: { headers: { "Content-Type": "multipart/form-data" } },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const changePassword = async (creds) => {
  return axios({
    method: "POST",
    url: `http://localhost:8080/api/v1/auth/changePassword`,
    data: creds,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  });
};
