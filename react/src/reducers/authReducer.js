import { LOGIN_SUCCESS } from "./actions/types";

const INITIAL_STATE = {
  isLoggedIn: false,
  username: undefined,
};

export default (state = { ...INITIAL_STATE }, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload.data,
        isLoggedIn: true,
      };
    default:
      return INITIAL_STATE;
  }
};
