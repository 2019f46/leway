import { EventEmitter } from "events";
import { IProduct } from "../models/ProductModel";

// Register this prduct search as a listener with the dispatcher
import dispatcher from "./Dispatchers";

/**
 * The Product search store is the "container" of the selected product and products states.
 * The purpose of the store is to have a centralize store from which multiple components can get date they are interested in.
 */
class ProductSearchStore extends EventEmitter {
    private products: IProduct[];
    private selectedProduct: IProduct;
    constructor() {
        super()
        this.products = [];
        this.selectedProduct = undefined as any;
    }

    /**
     * Get the current products
     */
    public getProductsState() {
        return this.products;
    }

    /**
     * This is a private method can only be access bu the productsearch actions
     * @param products The products to set
     */
    private setProductsState(products: IProduct[]) {
        this.products = products;
        this.emit("productsChange");
    }

    /**
     * Get the current selected product
     */
    public getSelectedProduct() {
        return this.selectedProduct;
    }

    /**
     * THis is a private methid that can only be access by the productsearch actions.
     * @param product The product to set as the current selected Product
     */
    private setSelectedProduct(product: IProduct) {
        this.selectedProduct = product;
        this.emit("selectedProductChange");
    }

    /**
     * Thiis is a centralized method which the dispatcher uses to set the states. 
     * @param action Dispatcher action
     */
    public handleProductOptions(action: any) {
        switch (action.type) {
            case "SET_PRODUCTS":
                this.setProductsState(action.products);
                break;

            case "SET_SELECTED":
                this.setSelectedProduct(action.product);
                break;
        }
    }
}

const prodSearch = new ProductSearchStore();
dispatcher.register(prodSearch.handleProductOptions.bind(prodSearch));
export default prodSearch;