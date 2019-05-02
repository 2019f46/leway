import Axios from "axios";
import { Checkbox, DetailsList, IColumn, Image } from "office-ui-fabric-react";
import { Slider } from 'office-ui-fabric-react/';
import React from "react";
import { IMagnetProduct } from "../../models/IMagnetProduct";
import { IProduct } from "../../models/IProduct";
import MagnetService, { IMagnetService } from "../../services/MagnetService";
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
    private magnetService: IMagnetService = new MagnetService();
    private timeout: any;
    private SLIDER_DELAY = 1000;
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
            let selectedProduct = await this.magnetService.getProduct(item.id);
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
                    let product = this.state.magneticProducts.find(prod => prod.guid === item.id);
                    let status = product ? product.isMagnetized : false;

                    return <Checkbox
                        defaultChecked={status}
                        disabled={!product ? true : false}
                        style={{ paddingTop: "5px" }}
                        onChange={(ev, checked) => this.onMagnetizeClick(ev, checked, item)} />;
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
                minWidth: 50,
                maxWidth: 150,
                onRender: (item: IProduct) => {
                    if (item && item.location) {
                        return <span>{`${item.location.x}, ${item.location.y}`}</span >;
                    } else {
                        return <span>Location has not been set</span>
                    }
                }
            },
            {
                key: 'weight',
                name: "Weight",
                fieldName: "id",
                minWidth: 50,
                maxWidth: 100,
                onRender: (item: IProduct) => {
                    let product = this.state.magneticProducts.find(prod => prod.guid === item.id);
                    let value = product ? product.weight : 0;
                    return <Slider min={0.5} max={3} step={0.1} value={value} disabled={value === 0 ? true : false} onChange={(number) => this.onWeightChange(number, product)} />
                }
            }
        ]
        this.setState({ columns: columns });
    }

    private onWeightChange = async (weight: number, product: IMagnetProduct | undefined) => {
        if (product && product.productId) {

            if (this.timeout) {
                window.clearTimeout(this.timeout);
            }

            product.weight = weight;
            this.timeout = window.setTimeout(() => {
                this.executeWeightChange(product);
            }, this.SLIDER_DELAY);
        }
    }

    private executeWeightChange = async (product: IMagnetProduct) => {
        if (product && product.productId) {
            await this.magnetService.updateProduct(product.productId, product);
        }
    }
}