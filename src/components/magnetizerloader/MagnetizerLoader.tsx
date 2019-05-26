import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import React from "react";
import { IMagnetProduct } from "../../models/IMagnetProduct";
import { IProduct } from "../../models/IProduct";
import MagnetService, { IMagnetService } from "../../services/MagnetService";
import SearchService, { ISearchService } from "../../services/SearchService";
import MagnetProductSettings from "../magnetizedproductsettings/MagnetProductSettings";
import styles from "./MagnetizerLoader.module.scss";

/** Interface which defines the states of MagnetizerLoader */
export interface IMagnetizerLoaderState {
    /** State which decides whether a spinner should be showed. */
    spinner: boolean;

    /** All products */
    allProducts: IProduct[];

    /** All magnetic products */
    magneticProducts: IMagnetProduct[]
}

/** This class is responsible for synchronising the magnetizer database with the product database */
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
            view = <MagnetProductSettings products={allProducts} magneticProducts={this.state.magneticProducts} />
        }

        return (
            <div className={styles.magnetizerLoaderContainer}>
                {view}
            </div>
        );
    }

    /** Lifecycle method, triggered when the component is initially loaded into the DOM */
    public async componentDidMount() {
        this.setState({
            allProducts: await this.searchService.getProduct("a"),
            magneticProducts: await this.magnetService.getAllProducts(),
            spinner: false
        });
        await this.syncDatabases();
    }

    /** Method which initites the synchronization process. */
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