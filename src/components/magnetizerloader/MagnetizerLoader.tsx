import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import React from "react";
import { IMagnetProduct } from "../../models/IMagnetProduct";
import { IProduct } from "../../models/IProduct";
import MagnetService, { IMagnetService } from "../../services/MagnetService";
import SearchService, { ISearchService } from "../../services/SearchService";
import MagnetizedProducts from "../magnetizedproducts/MagnetizedProduct";
import styles from "./MagnetizerLoader.module.scss";

export interface IMagnetizerLoaderState {
    spinner: boolean;
    allProducts: IProduct[];
    magneticProducts: IMagnetProduct[]
}

export default class MagnetizerLoader extends React.Component<{}, IMagnetizerLoaderState> {
    private searchService: ISearchService = new SearchService();
    private magnetService: IMagnetService = new MagnetService();
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

        if (allProducts && allProducts.length > 0 && magneticProducts && !this.state.spinner) {
            view = <MagnetizedProducts products={allProducts} magneticProducts={this.state.magneticProducts} />
        }

        return (
            <div className={styles.magnetizerLoaderContainer}>
                {view}
            </div>
        );
    }

    public async componentDidMount() {
        this.setState({
            allProducts: await this.searchService.getProduct("a"),
            magneticProducts: await this.magnetService.getAllProducts(),
            spinner: false
        });
        await this.syncDatabases();
    }

    private syncDatabases = async () => {
        const { allProducts } = this.state;

        for (let i = 0; i < allProducts.length; i++) {
            let product = allProducts[i];
            try {
                await this.magnetService.getProduct(product.id);
            } catch (e) {
                if (product.location && product.location.x && product.location.y) {
                    await this.magnetService.addProduct({ guid: product.id, Name: product.name, isMagnetized: false, weight: 1, location: { x: product.location.x.toString(), y: product.location.y.toString() } });
                }
            }
        }
    }
}