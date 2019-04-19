import { combineReducers } from "redux";
import ProductSearchReducer from "./productsearch/ProductSearchReducer";

/**
 * Serves to separate the reducers, while keeping a single reducer.
 * The redux store uses this combined reducer to hold all of its data.
 */
export default combineReducers({
    productData: ProductSearchReducer
});