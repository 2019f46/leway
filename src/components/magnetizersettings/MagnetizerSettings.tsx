import Axios from "axios";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import React from "react";
import { IMagnetProduct } from "../../models/IMagnetProduct";
import { IProduct } from "../../models/IProduct";
import SearchService, { ISearchService } from "../../services/SearchService";
import MagnetizedProducts from "../magnetizedproducts/MagnetizedProducts";
import styles from "./MagnetizerSettings.module.scss";

export interface IMagnetizerSettingsProps {
}
export interface IMagnetizerSettingsState {
    spinner: boolean;
    allProducts: IProduct[];
    magneticProducts: IMagnetProduct[]
}

export default class MagnetizerSettings extends React.Component<IMagnetizerSettingsProps, IMagnetizerSettingsState> {
    private searchService: ISearchService = new SearchService();
    constructor(props: any) {
        super(props);
        this.state = {
            spinner: true,
            allProducts: [],
            magneticProducts: []
        };
    }

    render() {
        const { allProducts, magneticProducts } = this.state;
        let view: JSX.Element = this.state.spinner ? <Spinner size={SpinnerSize.large} /> : <span />;

        if (allProducts && allProducts.length > 0 && magneticProducts) {
            view = <MagnetizedProducts products={allProducts} magneticProducts={this.state.magneticProducts} />
        }

        return (
            <div className={styles.magnetizerSettingsContainer}>
                {view}
            </div>
        );
    }

    public async componentDidMount() {
        await this.getAllMagneticPropducts();
        this.setState({ allProducts: await this.searchService.getProduct("a"), spinner: false });
        await this.syncDatabases();
    }

    private syncDatabases = async () => {
        const { allProducts } = this.state;

        for (let i = 0; i < allProducts.length; i++) {
            try {
                await Axios.get(`https://magnetizer20190429034033.azurewebsites.net/api/products/${allProducts[i].id}`);
            } catch (e) {
                await Axios.post("https://magnetizer20190429034033.azurewebsites.net/api/products", { Guid: allProducts[i].id, Name: allProducts[i].name, IsMagnetized: false });
            }
        }
    }

    private getAllMagneticPropducts = async () => {
        let response = await Axios.get("https://magnetizer20190429034033.azurewebsites.net/api/products");
        let result = await response.data;
        this.setState({ magneticProducts: result });
    }
}