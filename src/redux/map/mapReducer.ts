import { IProduct } from "../../models/ProductModel";
import { SET_SELECTED_PRODUCT, SET_PRODUCT_LIST, SET_SEARCH_VALUE } from "../types";

const initialState: { products: IProduct[]; selectedProduct?: IProduct | undefined; searchValue: string } = {
    products: [], selectedProduct: undefined, searchValue: ""
}

export default function (state = initialState, action: { type: string, data: any }) {
    switch (action.type) {
        case SET_SELECTED_PRODUCT:
            return { ...state, selectedProduct: action.data }
        case SET_PRODUCT_LIST:
            return { ...state, products: action.data }
        case SET_SEARCH_VALUE:
            return { ...state, searchValue: action.data }
        default:
            return state;
    }
}