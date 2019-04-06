import { IProduct } from "../../models/ProductModel";
import { SET_SELECTED_PRODUCT, SET_PRODUCT_LIST } from "../types";

export function setSelectedProduct(selectedProduct: IProduct) {
    return function (dispatch: any) {
        dispatch({
            type: SET_SELECTED_PRODUCT,
            data: selectedProduct
        });
    }
}

export function setProductList(list: IProduct[]) {
    return function (dispatch: any) {
        dispatch({
            type: SET_PRODUCT_LIST,
            data: list
        });
    }
}
