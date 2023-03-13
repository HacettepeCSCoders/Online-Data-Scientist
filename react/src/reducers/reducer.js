import { combineReducers } from "redux";
import AuthReducer from "./authReducer";
import storage from "redux-persist/lib/storage";

const appReducer = combineReducers({
  auth: AuthReducer,
});
export default (state, action) => {
  if (action.type === "LOGOUT_SUCCESS") {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
