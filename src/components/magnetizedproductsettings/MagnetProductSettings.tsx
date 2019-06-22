import { Checkbox, DetailsList, IColumn, Image, Slider } from "office-ui-fabric-react";
import React from "react";
import { IMagnetProduct } from "../../models/IMagnetProduct";
import { IProduct } from "../../models/IProduct";
import MagnetService, { IMagnetService } from "../../services/MagnetService";
import SearchService, { ISearchService } from "../../services/SearchService";
import styles from "./MagnetProductSettings.module.scss";

/** Interface which defines the properties of MagnetProductSettings */
export interface IMagnetProductSettingsProps {
    // /** List of all products */
    // products: IProduct[];

    // /** List of all magnetized products */
    // magneticProducts: IMagnetProduct[];
}

/** Interface which defines the states of MagnetProductSettings */
export interface IMagnetProductSettingsState {
    /** Table columns used for the list */
    columns: IColumn[] | undefined;

    /** All products */
    allProducts: IProduct[];

    /** All magnetic products */
    magneticProducts: IMagnetProduct[];
}

/**
 * This component will render a list of all products. Products in this list will be able to be magnetized / demagnetized.
 * Product weights will also be adjustable. 
 */
export default class MagnetProductSettings extends React.Component<IMagnetProductSettingsProps, IMagnetProductSettingsState> {
    private searchService: ISearchService = new SearchService();
    private magnetService: IMagnetService = new MagnetService();
    private timeout: any;
    private SLIDER_DELAY = 200;
    constructor(props: IMagnetProductSettingsProps) {
        super(props);
        this.state = {
            columns: undefined,
            allProducts: [],
            magneticProducts: []
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

    /**
     * Life cycle method, triggered when the component is initially loaded into the dom.
     */
    public componentDidMount = async () => {
        this.setListColumns();
        this.setState({
            allProducts: await this.searchService.getProduct("a"),
            magneticProducts: await this.magnetService.getAllProducts(),
        });
    }

    /**
     * This method is triggered when the magnetizer checkbox is clicked
     * @param ev Click event
     * @param checked Value of the checkbox (checked/unchecked)
     * @param item Product clicked
     */
    private onMagnetizeClick = async (ev: React.FormEvent<HTMLElement> | undefined, checked: boolean | undefined, item: IProduct) => {
        if (ev && checked !== undefined) {
            let productToMagnetize = this.state.magneticProducts.find(p => p.guid === item.id);
            if (productToMagnetize) {
                productToMagnetize.isMagnetized = checked;
                await this.magnetService.updateProduct(productToMagnetize.productId as string, productToMagnetize);
            }
        }
    }

    /** This method generated the list columns */
    private setListColumns = () => {
        const columns: IColumn[] = [
            {
                key: 'name',
                name: 'Name',
                fieldName: 'name',
                minWidth: 50,
                maxWidth: 200,
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
                    return <Slider min={1} max={3} step={0.1} value={value} disabled={value === 0 ? true : false} onChange={(number) => this.onWeightChange(number, product)} />
                }
            }
        ]
        this.setState({ columns: columns });
    }

    /**
     * Method is triggered when the weight of a product is altered. Method is ONLY triggered if more than 1 second has passed since the weight was altered.
     * @param weight New product weight
     * @param product Product having its weight changed
     */
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

    /**
    * Execute weight change - Method is ONLY triggered if more than 1 second has passed since the weight was altered.
    * @param product Product having its weight changed
    */
    private executeWeightChange = async (product: IMagnetProduct) => {
        if (product && product.productId) {
            await this.magnetService.updateProduct(product.productId, product);
        }
    }
}