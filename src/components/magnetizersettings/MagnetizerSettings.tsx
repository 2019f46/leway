import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import React from "react";
import { IProduct } from "../../models/ProductModel";
import FakeSearchService from "../../services/fakes/FakeSearchService";
import SearchService, { ISearchService } from "../../services/SearchService";
import MagnetizedProducts from "../magnetizedproducts/MagnetizedProducts";
import styles from "./MagnetizerSettings.module.scss";

export interface MagnetizerSettingsProps {
    fakeData?: boolean;
}
export interface MagnetizerSettingsState {
    spinner: boolean;
    allProducts: IProduct[];
}

export default class MagnetizerSettings extends React.Component<MagnetizerSettingsProps, MagnetizerSettingsState> {
    private searchService: ISearchService = this.props.fakeData ? new FakeSearchService() : new SearchService();
    constructor(props: any) {
        super(props);
        this.state = {
            spinner: true,
            allProducts: []
        };
    }

    render() {
        const { allProducts } = this.state;
        let view: JSX.Element = this.state.spinner ? <Spinner size={SpinnerSize.large} /> : <span />;

        if (allProducts && allProducts.length > 0) {
            view = <MagnetizedProducts products={allProducts} fakeData={this.props.fakeData} />
        }

        return (
            <div className={styles.magnetizerSettingsContainer}>
                {view}
            </div>
        );
    }

    public async componentDidMount() {
        this.setState({ allProducts: await this.searchService.getProduct("a"), spinner: false });
    }
}