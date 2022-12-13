import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
};

const composeEnhancers =
  typeof window === "object" && window.REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export const config = (rootReducer) => {
  const middleware = [];
  const enhancers = [];

  middleware.push(thunk);
  enhancers.push(applyMiddleware(...middleware));

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const createAppropriateStore = createStore;
  const store = createAppropriateStore(
    persistedReducer,
    applyMiddleware(thunk)
  );

  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
};
