import {config} from "./reducers/configureStore";
import reducers from "./reducers/reducer";

const createStore = () => {
    const {store, persistor} = config(reducers);

    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = require(".").reducers;
            store.replaceReducer(nextRootReducer);
        });
    }

    return {store, persistor};
};

const {store, persistor} = createStore();
export {store, persistor};
