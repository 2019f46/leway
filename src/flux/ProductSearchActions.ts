import dispatcher from "./Dispatchers";
import { IProduct } from "../models/ProductModel";

/**
 * This are the actions which components who can alter the ProductSearchStore can use
 */
class ProductSearchActions {

    /**
     * This method crates a action object which is sent to the store to handle
     * @param products Products to set
     */
    public setProducts(products: IProduct[]): void {
        dispatcher.dispatch({
            type: "SET_PRODUCTS",
            products: products
        });
    }

    /**
     * This method crates a action object which is sent to the store to handle
     * @param products Product to set
     */
    public setSelectedProduct(product: IProduct): void {
        dispatcher.dispatch({
            type: "SET_SELECTED",
            product: product
        });
    }
}

export default new ProductSearchActions();
