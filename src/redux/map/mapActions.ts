import { IProduct } from "../../models/ProductModel";
import { SET_SELECTED_PRODUCT, SET_PRODUCT_LIST, SET_SEARCH_VALUE } from "../types";

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

export function setSearchValue(value: string){
    return function(dispatch:any){
        dispatch({
            type: SET_SEARCH_VALUE,
            data: value
        });
    }
}
