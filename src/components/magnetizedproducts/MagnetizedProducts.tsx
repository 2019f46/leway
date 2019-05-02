import Axios from "axios";
import { Checkbox, DetailsList, IColumn, Image } from "office-ui-fabric-react";
import React from "react";
import { IMagnetProduct } from "../../models/IMagnetProduct";
import { IProduct } from "../../models/IProduct";
import styles from "./MagnetizedProducts.module.scss";

export interface IMagnetizedProductsProps {
    products: IProduct[];
    magneticProducts: IMagnetProduct[];
}

export interface IMagnetizedProductsState {
    columns: IColumn[] | undefined;
    allProducts: IProduct[];
    magneticProducts: IMagnetProduct[];
}

export default class MagnetizedProducts extends React.Component<IMagnetizedProductsProps, IMagnetizedProductsState> {
    constructor(props: IMagnetizedProductsProps) {
        super(props);
        this.state = {
            columns: undefined,
            allProducts: this.props.products,
            magneticProducts: this.props.magneticProducts
        };
    }
    public render() {
        return (
            <DetailsList
                className={styles.magnetizedProductsContainer}
                columns={this.state.columns}
                items={this.state.allProducts}
            />
        );
    }

    public componentDidMount() {
        this.setListColumns();
    }

    private onMagnetizeClick = async (ev: React.FormEvent<HTMLElement> | undefined, checked: boolean | undefined, item: IProduct) => {
        if (ev && checked !== undefined) {
            let response = await Axios.get(`https://magnetizer20190429034033.azurewebsites.net/api/products/${item.id}`);
            let selectedProduct: IMagnetProduct = await response.data;
            selectedProduct.isMagnetized = checked;

            await Axios.put(`https://magnetizer20190429034033.azurewebsites.net/api/products/${selectedProduct.productId}`, selectedProduct)

        }
    }

    private setListColumns = () => {
        const columns: IColumn[] = [
            {
                key: 'name',
                name: 'Name',
                fieldName: 'name',
                minWidth: 50,
                maxWidth: 300,
            },
            {
                key: 'magnetized',
                name: 'Magnetized',
                fieldName: 'magnetized',
                minWidth: 30,
                maxWidth: 120,
                onRender: (item: IProduct) => {
                    let checkedStatus = this.state.magneticProducts.find(prod => prod.guid === item.id);
                    return <Checkbox defaultChecked={checkedStatus ? checkedStatus.isMagnetized : false} style={{ paddingTop: "5px" }} onChange={(ev, checked) => this.onMagnetizeClick(ev, checked, item)} />;
                }
            },
            {
                key: 'image',
                name: 'Image',
                fieldName: 'image',
                minWidth: 30,
                maxWidth: 100,
                onRender: (item: IProduct) => {
                    return <Image src={item.image} height={50} width={50} />;
                }
            },
            {
                key: 'quantity',
                name: 'Remaining',
                fieldName: 'quantity',
                minWidth: 30,
                maxWidth: 100,
            },
            {
                key: 'location',
                name: 'Location',
                fieldName: 'location',
                minWidth: 30,
                maxWidth: 100,
                onRender: (item: IProduct) => {
                    if (item && item.location) {
                        return <span>{`${item.location.x}, ${item.location.y}`}</span >;
                    } else {
                        return <span>Location has not been set</span>
                    }
                }
            }
        ]
        this.setState({ columns: columns });
    }
}