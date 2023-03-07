import { login } from "../../services/authService";
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

export const loginHandler = (auth) => {
  return async function(dispatch) {
    const response = await login(auth);
    dispatch(loginSuccess(response));
    setAuth(response);
    console.log(response);
    return response;
  };
};
