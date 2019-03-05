import * as React from "react";
import { Image } from "office-ui-fabric-react";
import { IProduct } from "../../models/ProductModel";
import styles from "./Product.module.scss";

export interface IProductProps {
    product: IProduct;
}

export interface IProductState {

}

export default class Product extends React.Component<IProductProps, IProductState> {

    public render(): JSX.Element {
        let searchResults: JSX.Element = (
            <div className={styles.resultsContainer}>
                <div className={styles.left}>
                    <h3>{this.props.product.name}</h3>
                    <span>{this.props.product.description}</span>
                </div>
                <div className={styles.right}>
                    <Image src={this.props.product.image} height={75} width={75} />
                    <h4>{this.props.product.price + "DKK"}</h4>
                </div>
            </div>
        );
        return (
            searchResults
        );
    }
}