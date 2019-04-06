import { IProduct } from "../../models/ProductModel";
import { SET_SELECTED_PRODUCT, SET_PRODUCT_LIST } from "../types";

const initialState: { products: IProduct[]; selectedProduct?: IProduct | undefined; } = {
    products: [], selectedProduct: undefined
}

export default function (state = initialState, action: { type: string, data: any }) {
    switch (action.type) {
        case SET_SELECTED_PRODUCT:
            return { ...state, selectedProduct: action.data }
        case SET_PRODUCT_LIST:
            return { ...state, products: action.data }
        default:
            return state;
    }
}