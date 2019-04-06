import * as React from "react";
import { SearchBox } from "office-ui-fabric-react";
import styles from "./ProductSearch.module.scss";
import SearchService, { ISearchService } from "../../services/SearchService";
import FakeSearchService from "../../services/fakes/FakeSearchService";
import { IProduct } from "../../models/ProductModel";
import Product from "../product/Product";
import { connect } from "react-redux";
import { setSelectedProduct, setProductList } from "../../redux/map/mapActions";
// import ProductSearchStore from "../../flux/ProductSearchStore";
// import ProductSearchActions from "../../flux/ProductSearchActions";

/**
 * Properties recived by the product Search Component.
 * @param fakeData Optional prop, determines whether or not the component uses the real or fake search service.
 */
export interface IProductSearchProps {
    fakeData?: boolean;
}

interface reduxProps {
    setProductList: any;
    setSelectedProduct: any;
}

/**
 * States managed by ProductSearchComponent
 * @param products Required prop, List of products to show
 * @param selectedProduct Optional prop, is set when a product is selected. 
 */
export interface IProductSearchState {
    products?: IProduct[] | undefined;
    selectedProduct?: IProduct | undefined;
}

type props = IProductSearchProps & reduxProps;

/**
 * This component is responsible for handling the search functionality of the application. 
 * This component is self contained which means that the component contains all the logic search logic. 
 * From the rendering of the Searchbox (subcomponent) to managing the logic of how the search results are handled and shown.
 */
class ProductSearch extends React.Component<props, IProductSearchState> {
    private searchService: ISearchService;
    private timeout: any;
    private SEARCH_DELAY = 1000;
    constructor(props: any) {
        super(props);
        this.state = {
            products: [],
            selectedProduct: undefined,
        };
        this.searchService = this.props.fakeData ? new FakeSearchService() : new SearchService();
    }

    /**
     * Standard function in all react components. This function activates the react render engine and renders the desired content.
     */
    public render(): JSX.Element {
        let searchResults: JSX.Element[] = [];
        if (!this.state.selectedProduct) {
            if (this.state.products) {
                this.state.products.forEach(element => {
                    searchResults.push(<Product product={element} onProductClick={this.onProductClick} key={element.id} />);
                });
            }
        }

        return (
            <div className={styles.productSearchContainer} >
                <div className={styles.searchBoxContainer}>
                    <SearchBox
                        iconProps={{ iconName: this.state.selectedProduct ? "ReturnToSession" : "Search", onClick: this.onBackIconClick }}
                        placeholder="Search for products"
                        onClear={this.clearSearch}
                        onChange={value => this.onProductSearch(value)} />
                </div>
                {this.state.selectedProduct ? <Product product={this.state.selectedProduct} /> : searchResults}
            </div>
        );
    }

    /**
     * This method is called when clicking the icon on the searchbox when the selected product state is set.
     * This method handles the transition from a single product item to showing the rpevios list of products. 
     */
    private onBackIconClick = () => {
        if (this.state.selectedProduct) {
            this.setState({ selectedProduct: undefined });
            this.props.setSelectedProduct(undefined);
        }
    }

    /**
     * This method is called when a list is products is rendered, and a product is selected by the end user.
     * This methods sets the state of the selected product which then changes the view from a list of products to a single product.
     * @param product The selected product
     */
    private onProductClick = (product: IProduct) => {
        this.setState({ selectedProduct: product });
        this.props.setSelectedProduct(product);
    }

    /**
     * When clearing the searchbox, any earlier search results are removed from the component state, and the selected product is removed
     */
    private clearSearch = () => {
        this.setState({ selectedProduct: undefined, products: undefined });
        this.props.setProductList([]);
        this.props.setSelectedProduct(undefined);
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
        this.props.setProductList(products);
        this.setState({ products: products });
    }
}

export default connect(null, { setProductList, setSelectedProduct })(ProductSearch);
