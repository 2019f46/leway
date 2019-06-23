import Axios from "axios";
import { Checkbox, DetailsList, IColumn, Image, PrimaryButton, Slider, Spinner, SpinnerSize } from "office-ui-fabric-react";
import React from "react";
import { IMagnetProduct } from "../../models/IMagnetProduct";
import { IProduct } from "../../models/IProduct";
import MagnetService, { IMagnetService } from "../../services/MagnetService";
import SearchService, { ISearchService } from "../../services/SearchService";
import styles from "./MagnetProductSettings.module.scss";

/** Interface which defines the states of MagnetProductSettings */
export interface IMagnetProductSettingsState {
    /** Table columns used for the list */
    columns: IColumn[] | undefined;

    /** All products */
    allProducts: IMagnetProduct[];

    standardProducts: IProduct[];

    spinner: boolean;
}

/**
 * This component will render a list of all products. Products in this list will be able to be magnetized / demagnetized.
 * Product weights will also be adjustable. 
 */
export default class MagnetProductSettings extends React.Component<{}, IMagnetProductSettingsState> {
    private searchService: ISearchService = new SearchService();
    private magnetService: IMagnetService = new MagnetService();
    private timeout: any;
    private SLIDER_DELAY = 200;
    private UPDATE_URL = "https://lewayfindersync.azurewebsites.net/api/SyncLeWay?code=B1GKF3GaYK5Uwc7aUGQX0XrEvb5ahJgDFfJJjWj2czaxcdd1toZPqQ==";
    constructor(props: any) {
        super(props);
        this.state = {
            columns: undefined,
            allProducts: [],
            spinner: true,
            standardProducts: []
        };
    }
    public render() {
        let partialView = this.state.spinner ?
            <Spinner style={{ paddingTop: "25px" }} size={SpinnerSize.large} /> :
            <DetailsList
                className={styles.magnetizedProductsContainer}
                columns={this.state.columns}
                items={this.state.allProducts}
            />;

        let updater: JSX.Element = <PrimaryButton text={"Sync Database"} onClick={this.onClickSync} />;

        return (
            <div>
                <div style={{ textAlign: "right" }} hidden={this.state.spinner ? true : false}>
                    {updater}
                </div>
                {partialView}
            </div>
        );
    }

    private onClickSync = async () => {
        this.setState({ spinner: true });
        try {
            let result = await Axios.get(this.UPDATE_URL);
            if (result.status === 200 && result.data === "Success") {
                await this.setInitialStates();
            }
        } catch (e) {
            alert("Failed to sync the database");
        }
    }

    /**
     * Life cycle method, triggered when the component is initially loaded into the dom.
     */
    public componentDidMount = async () => {
        this.setListColumns();
        await this.setInitialStates();
    }

    
    public setInitialStates = async () => {
        this.setState({
            standardProducts: await this.searchService.getProduct("a"),
            allProducts: await this.magnetService.getAllProducts(),
            spinner: false
        });
    }

    /**
     * This method is triggered when the magnetizer checkbox is clicked
     * @param ev Click event
     * @param checked Value of the checkbox (checked/unchecked)
     * @param item Product clicked
     */
    private onMagnetizeClick = async (ev: React.FormEvent<HTMLElement> | undefined, checked: boolean | undefined, item: IMagnetProduct) => {
        if (ev && checked !== undefined) {
            item.isMagnetized = checked;
            await this.magnetService.updateProduct(item.productId as string, item);
        }
    }

    /** This method generated the list columns */
    private setListColumns = () => {
        const columns: IColumn[] = [
            {
                key: 'name',
                name: 'Name',
                fieldName: 'name',
                minWidth: 70,
                maxWidth: 150,
            },
            {
                key: 'magnetized',
                name: 'Magnetized',
                fieldName: 'magnetized',
                minWidth: 70,
                maxWidth: 100,
                onRender: (item: IMagnetProduct) => {
                    return <Checkbox
                        defaultChecked={item.isMagnetized}
                        disabled={!item.location ? true : false}
                        style={{ paddingTop: "5px" }}
                        onChange={(ev, checked) => this.onMagnetizeClick(ev, checked, item)} />;
                }
            },
            {
                key: 'image',
                name: 'Image',
                fieldName: 'image',
                minWidth: 50,
                maxWidth: 100,
                onRender: (item: IMagnetProduct) => {
                    let imgProd = this.state.standardProducts.find(p => p.id === item.guid);
                    return <Image src={imgProd ? imgProd.image : undefined} height={50} width={50} />;
                }
            },
            {
                key: 'quantity',
                name: 'Remaining',
                fieldName: 'quantity',
                minWidth: 30,
                maxWidth: 100,
                className: styles.hideOnMobile,
                onRender: (item: IMagnetProduct) => {
                    let prod = this.state.standardProducts.find(p => p.id === item.guid);
                    return <span className={styles.hideOnMobile}>{prod ? prod.quantity : undefined}</span>
                }
            },
            {
                key: 'location',
                name: 'Location',
                fieldName: 'location',
                minWidth: 30,
                maxWidth: 100,
                className: styles.hideOnMobile,
                onRender: (item: IProduct) => {
                    if (item && item.location) {
                        return <span className={styles.hideOnMobile}>{`${item.location.x}, ${item.location.y}`}</span >;
                    } else {
                        return <span className={styles.hideOnMobile}>Location has not been set</span>
                    }
                }
            },
            {
                key: 'weight',
                name: "Weight",
                fieldName: "id",
                minWidth: 120,
                maxWidth: 300,
                className: styles.readjustWeight,
                onRender: (item: IMagnetProduct) => {
                    return (
                        <Slider min={1}
                            max={3}
                            step={0.1}
                            value={item.weight}
                            disabled={!item.location ? true : false}
                            onChange={(number) => this.onWeightChange(number, item)} />
                    );
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