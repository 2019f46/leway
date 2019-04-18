import * as React from "react";
import { Image, Icon, Link } from "office-ui-fabric-react";
import { IProduct } from "../../models/ProductModel";
import styles from "./Product.module.scss";

/**
 * Properties recived by the Product Component.
 * @param product Required prop, Is the product object to be rendered.
 * @param onProductClick Optional prop, callback to parent component, telling the parent which product was selected.
 */
export interface IProductProps {
    product: IProduct;
    onProductClick?: (prod: IProduct) => void;
    /** If this product has been chosen in the list */
    chosen?: boolean;
}

/**
 * States managed by Product
 * @param currentProduct The product which is currently being handled.
 */
export interface IProductState {
    currentProduct: IProduct;
}

/**
 * This component is used by the ProductSearch component. This component contains no logic and is only responsible for rendering a product.
 */
export default class Product extends React.Component<IProductProps, IProductState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentProduct: this.props.product
        };
    }
    /**
     * Standard function in all react components. This function activates the react render engine and renders the desired content.
     */
    public render(): JSX.Element {

        let searchResults: JSX.Element = (
            <div 
                className={this.props.chosen ? styles.resultContainer : styles.resultsEllipsis} 
                onClick={() => this.props.onProductClick ? this.props.onProductClick(this.props.product) : undefined}
            >
                <div className={styles.left}>
                    <h3>{this.state.currentProduct.name}</h3>
                    <span>{this.props.product.description}</span>
                </div>
                <div className={styles.right}>
                    <Image src={this.state.currentProduct.image} height={75} width={75} />
                    <h4>{this.props.product.price + "DKK"}</h4>
                </div>
            </div>
        );
        return (searchResults);
    }
}
