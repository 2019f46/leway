import { EventEmitter } from "events";
import { IProduct } from "../models/ProductModel";

// Register this prduct search as a listener with the dispatcher
import dispatcher from "./Dispatchers";

class ProductSearchStore extends EventEmitter {
    private products: IProduct[];
    private selectedProduct: IProduct;
    constructor() {
        super()
        this.products = [];
        this.selectedProduct = undefined as any;
    }

    public getProductsState() {
        return this.products;
    }

    private setProductsState(products: IProduct[]) {
        this.products = products;
        this.emit("productsChange");
    }

    public getSelectedProduct() {
        return this.selectedProduct;
    }

    private setSelectedProduct(product: IProduct) {
        this.selectedProduct = product;
        this.emit("selectedProductChange");
    }

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