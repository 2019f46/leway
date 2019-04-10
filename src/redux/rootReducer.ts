import { combineReducers } from "redux";
import mapReducer from "./map/mapReducer";

/**
 * Serves to separate the reducers, while keeping a single reducer.
 * The redux store uses this combined reducer to hold all of its data.
 */
export default combineReducers({
    productData: mapReducer
});