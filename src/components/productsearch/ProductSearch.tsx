import * as React from "react";
import { SearchBox, Image } from "office-ui-fabric-react";
import styles from "./ProductSearch.module.scss";
import SearchService, { ISearchService } from "../../services/SearchService";
import FakeSearchService from "../../services/FakeSearchService";
import { IProduct } from "../../models/ProductModel";
import Product from "../product/Product";

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
        let searchResults: JSX.Element[] = [];

        this.state.products.forEach(element => {
            searchResults.push(<Product product={element} />);
        });

        return (
            <div className={styles.productSearchContainer}>
                <div className={styles.searchBoxContainer}>
                    <SearchBox
                        placeholder="Search"
                        onClear={this.clearSearch}
                        onChange={value => this.onProductSearch(value)} />
                </div>
                {searchResults}
            </div>
        );
    }

    private clearSearch = () => {
        this.setState({ products: [] });
    }

    private onProductSearch = async (value: string): Promise<void> => {
        if (!value) {
            return;
        }

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
