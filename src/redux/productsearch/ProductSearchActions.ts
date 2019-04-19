import { IProduct } from "../../models/ProductModel";
import FakeSearchService from "../../services/fakes/FakeSearchService";
import SearchService, { ISearchService } from "../../services/SearchService";
import { SET_PRODUCT_LIST, SET_SEARCH_VALUE, SET_SELECTED_PRODUCT } from "../types";

export function setSelectedProduct(selectedProduct: IProduct) {
    return function (dispatch: any) {
        dispatch({
            type: SET_SELECTED_PRODUCT,
            data: selectedProduct
        });
    }
}

export function setProductList(query?: string, fake?: boolean) {
    if (query) {
        let searchService: ISearchService = fake ? new FakeSearchService() : new SearchService();
        return function (dispatch: any) {
            searchService.getProduct(query).then(products => {
                dispatch({
                    type: SET_PRODUCT_LIST,
                    data: products
                });
            });
        }
    } else {
        return function (dispatch: any) {
            dispatch({
                type: SET_PRODUCT_LIST,
                data: []
            });
        }
    }
}

export function setSearchValue(value: string) {
    return function (dispatch: any) {
        dispatch({
            type: SET_SEARCH_VALUE,
            data: value
        });
    }
}
