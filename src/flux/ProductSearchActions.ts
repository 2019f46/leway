import dispatcher from "./Dispatchers";
import { IProduct } from "../models/ProductModel";

class ProductSearchActions {
    public setProducts(products: IProduct[]): void {
        dispatcher.dispatch({
            type: "SET_PRODUCTS",
            products: products
        });
    }

    public setSelectedProduct(product: IProduct): void {
        dispatcher.dispatch({
            type: "SET_SELECTED",
            product: product
        });
    }
}

export default new ProductSearchActions();