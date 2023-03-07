import { login, signup } from "../../services/authService";
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "./types";
import { setAuth } from "../../services/api";

export const logoutSuccess = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

export const loginSuccess = (authState) => {
  return {
    type: LOGIN_SUCCESS,
    payload: authState,
  };
};

export const loginHandler = (creds) => {
  return async function (dispatch) {
    const response = await login(creds);
    dispatch(loginSuccess(response));
    setAuth(response);
    console.log(response.data);
    return response;
  };
};

export const signupHandler = (creds) => {
  return async function (dispatch) {
    const response = await signup(creds);
    return response;
  };
};