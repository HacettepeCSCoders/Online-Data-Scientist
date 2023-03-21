import { LOGIN_SUCCESS } from "./actions/types";
import { LOGOUT_SUCCESS } from "./actions/types";

const INITIAL_STATE = {
  isLoggedIn: false,
  username: undefined,
};

export default (state = { ...INITIAL_STATE }, action) => {
  if (action.type === LOGOUT_SUCCESS) return INITIAL_STATE;
  else if (action.type === LOGIN_SUCCESS) {
    return {
      ...action.payload.data,
      isLoggedIn: true,
    };
  }
  return state;
};