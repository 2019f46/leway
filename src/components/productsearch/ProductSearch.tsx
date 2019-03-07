import * as React from "react";
import { SearchBox, Image } from "office-ui-fabric-react";
import styles from "./ProductSearch.module.scss";
import SearchService, { ISearchService } from "../../services/SearchService";
import FakeSearchService from "../../services/FakeSearchService";
import { IProduct } from "../../models/ProductModel";
import Product from "../product/Product";

/**
 * Properties recived by the product Search Component.
 * @param fakeData Optional prop, determines whether or not the component uses the real or fake search service.
 */
export interface IProductSearchProps {
    fakeData?: boolean;
}

/**
 * States managed by ProductSearchComponent
 */
export interface IProductSearchState {
    products: IProduct[];
    selectedProduct?: IProduct;
}

/**
 * This component is responsible for handling the search functionality of the application. 
 * This component is self contained which means that the component contains all the logic search logic. 
 * From the rendering of the Searchbox (subcomponent) to managing the logic of how the search results are handled and shown.
 */
export default class ProductSearch extends React.Component<IProductSearchProps, IProductSearchState> {
    private searchService: ISearchService;
    private timeout: any;
    private SEARCH_DELAY = 1000;
    constructor(props: any) {
        super(props);
        this.state = {
            products: [],
            selectedProduct: undefined
        };
        this.searchService = this.props.fakeData ? new FakeSearchService() : new SearchService();
    }

    /**
     * Standard function in all react components. This function activates the react render engine and renders the desired content.
     */
    public render(): JSX.Element {
        let searchResults: JSX.Element[] = [];

        this.state.products.forEach(element => {
            searchResults.push(<Product product={element} onProductClick={this.onProductClick} onCancel={this.onCancel} key={element.price} />);
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

    private onProductClick = (product: IProduct) => {
        this.setState({ selectedProduct: product });
    }

    private onCancel = () => {
        this.setState({ selectedProduct: undefined });
    }

    /**
     * When clearing the searchbox, any earlier search results are removed from the component state.
     */
    private clearSearch = () => {
        this.setState({ products: [] });
    }

    /**
     * This function handlers what happens when the end-user types into the search box.
     * If the usuer continiously types, no search is performed, but
     * if the user has not performed a keypress in the last 1000ms, a search is performed.
     * This function does not directly perform a product search, instead it calls on the function exrcuteProductSearch.
     * @param value Input value typed by end user
     */
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

    /**
     * This function is managed by the onProduct search and is responsible for contacting the search service which then performs a product search.
     * @param value Input value typed by end user
     */
    private executeProductSearch = async (value: string): Promise<void> => {
        let products = await this.searchService.getProduct(value);
        this.setState({ products: products });
    }
}
