import { Image } from "office-ui-fabric-react";
import * as React from "react";
import { IProduct } from "../../models/IProduct";
import styles from "./Product.module.scss";

/** Interface which defines props used by Product component */
export interface IProductProps {
    /** Required prop, Is the product object to be rendered. */
    product: IProduct;

    /** Optional prop, callback to parent component, telling the parent which product was selected */
    onProductClick?: (prod: IProduct) => void;

    /** If this product has been chosen in the list */
    chosen?: boolean;
}

/**
 * States managed by Product
*/
export interface IProductState {
    /** The product which is currently being handled */
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
        return (
            <div
                className={this.props.chosen ? styles.resultContainer : styles.resultsEllipsis}
                onClick={() => this.props.onProductClick ? this.props.onProductClick(this.props.product) : undefined}>
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
    }
}
