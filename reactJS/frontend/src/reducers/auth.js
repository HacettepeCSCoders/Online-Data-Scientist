import { LOGIN_SUCCESS } from "./actions/types";

const INITIAL_STATE = {
  user: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};
