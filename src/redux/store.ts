import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";

const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);
let data;
if (isLocalhost) {
    data = require('redux-devtools-extension');
}

const initialState = {}

const middleware = [thunk];

const store = createStore(rootReducer,
    initialState,
    !isLocalhost ? applyMiddleware(...middleware) : data.composeWithDevTools(
        applyMiddleware(...middleware)
    )

);

export default store;