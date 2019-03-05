import * as React from "react";
import { SearchBox } from "office-ui-fabric-react";
import styles from "./ProductSearch.module.scss";
import SearchService, { ISearchService } from "../../services/SearchService";
import FakeSearchService from "../../services/FakeSearchService";
import { IProduct } from "../../models/ProductModel";

export interface IProductSearchProps {
    fakeData?: boolean;
}

export interface IProductSearchState {
    products: IProduct[];
}

export default class ProductSearch extends React.Component<IProductSearchProps, IProductSearchState> {
    private searchService: ISearchService;
    private timeout: any;
    private SEARCH_DELAY = 1000;
    constructor(props: any) {
        super(props);
        this.state = {
            products: []
        };
        this.searchService = this.props.fakeData ? new FakeSearchService() : new SearchService();
    }
    public render(): JSX.Element {
        return (
            <div className={styles.productSearchContainer}>
                <div className={styles.searchBoxContainer}>
                    <SearchBox
                        placeholder="Search"
                        onChange={value => this.onProductSearch(value)} />
                </div>
            </div>
        );
    }

    private onProductSearch = async (value: string): Promise<void> => {
        if (this.timeout) {
            window.clearTimeout(this.timeout);
        }
        this.timeout = window.setTimeout(() => {
            this.executeProductSearch(value);
        }, this.SEARCH_DELAY);
    }

    private executeProductSearch = async (value: string): Promise<void> => {
        let products = await this.searchService.getProduct(value);
        this.setState({ products: products });
    }
}
