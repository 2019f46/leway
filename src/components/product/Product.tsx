import * as React from "react";
import { Image, Icon } from "office-ui-fabric-react";
import { IProduct } from "../../models/ProductModel";
import styles from "./Product.module.scss";

/**
 * Properties recived by the Product Component.
 * @param product Required prop, and is the product object to be rendered.
 */
export interface IProductProps {
    product: IProduct;
    onProductClick: (prod: IProduct) => void;
    isProductresult?: boolean;
}

export interface IProductState {
    isResult: boolean | undefined;
    currentProduct: IProduct;
}

/**
 * This component is used by the ProductSearch component. This component contains no logic and is only responsible for rendering a product.
 */
export default class Product extends React.Component<IProductProps, IProductState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isResult: this.props.isProductresult,
            currentProduct: this.props.product
        };
    }
    /**
     * Standard function in all react components. This function activates the react render engine and renders the desired content.
     */
    public render(): JSX.Element {
        let backBtn: JSX.Element = this.state.isResult ?
            <Icon iconName="NavigateBack" onClick={() => this.props.onProductClick(undefined as any)} style={{ fontSize: "50px" }} />
            : undefined as any;

        let searchResults: JSX.Element = (
            <div className={styles.resultsContainer} onClick={() => this.props.onProductClick(this.props.product)}>
                <div className={styles.left}>
                    <h3>{this.state.currentProduct.name}</h3>
                    <span>{this.props.product.description}</span>
                </div>
                <div className={styles.right}>
                    <Image src={this.state.currentProduct.image} height={75} width={75} />
                    <h4>{this.props.product.price + "DKK"}</h4>
                </div>
                {backBtn}
            </div>
        );
        return (searchResults);
    }
}
