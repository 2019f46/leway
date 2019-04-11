import * as React from "react";
import { SearchBox, Spinner } from "office-ui-fabric-react";
import styles from "./ProductSearch.module.scss";
import SearchService, { ISearchService } from "../../services/SearchService";
import FakeSearchService from "../../services/fakes/FakeSearchService";
import { IProduct } from "../../models/ProductModel";
import Product from "../product/Product";
import { connect } from "react-redux";
import { setSelectedProduct, setProductList, setSearchValue } from "../../redux/map/mapActions";

/**
 * Properties recived by the product Search Component
 */
export interface IProductSearchProps {
  /**
   * fakeData Optional prop, determines whether or not the component uses the real or fake search service.
   */
  fakeData?: boolean;
}

/**
 * This interface defines the props provided by the redux store.
 */
interface IReduxProps {
  /**
   * Set the product list in the redux store.
   */
  setProductList: (products: IProduct[]) => void;
  /**
   * Set the selected product in the redux store
   */
  setSelectedProduct: (product: IProduct | undefined) => void;
  /** Set the searched value */
  setSearchValue: (value: string) => void;
  /**
   * State of the redux store
   */
  productData: { products: IProduct[]; selectedProduct: IProduct; searchValue: string; };
  /** The value that is searched */

}

type props = IProductSearchProps & IReduxProps;

interface IProductSearchState{
    spinpls: boolean;
}

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
    this.searchService = this.props.fakeData
      ? new FakeSearchService()
      : new SearchService();
      this.state = {spinpls: false};
  }

  /**
   * Standard function in all react components. This function activates the react render engine and renders the desired content.
   */
  public render(): JSX.Element {
    let searchResults: JSX.Element[] = [];

    const { selectedProduct, products, searchValue } = this.props.productData;

    if (!selectedProduct && products && products.length > 0) {
      products.forEach(element => {
        searchResults.push(
          <Product
            product={element}
            onProductClick={this.onProductClick}
            key={element.id + Math.random()*100}
          />
        );
      });
    }

    return (
      <div className={styles.productSearchContainer}>
        <div
          className={selectedProduct ? styles.searchBoxContainer : undefined}
        >
          <SearchBox
            iconProps={{
              iconName: selectedProduct ? "ReturnToSession" : "Search",
              onClick: this.onBackIconClick
            }}
            placeholder="Search for products"
            onClear={this.clearSearch}
            onChange={value => this.onProductSearch(value)}
            value={searchValue}
          />
        </div>
        {selectedProduct ? (
          <Product product={selectedProduct} />
        ) : (
          searchResults
        )}
        {this.state.spinpls ? <Spinner style={{marginTop: "5px"}}/> : undefined}
      </div>
    );
  }

  /**
   * This method is called when clicking the icon on the searchbox when the selected product state is set.
   * This method handles the transition from a single product item to showing the rpevios list of products.
   */
  private onBackIconClick = () => {
    const { selectedProduct } = this.props.productData;
    if (selectedProduct) {
      this.props.setSelectedProduct(undefined);
    }
  };

  /**
   * This method is called when a list is products is rendered, and a product is selected by the end user.
   * This methods sets the state of the selected product which then changes the view from a list of products to a single product.
   * @param product The selected product
   */
  private onProductClick = (product: IProduct) => {
    this.props.setSelectedProduct(product);
  };

  /**
   * When clearing the searchbox, any earlier search results are removed from the component state, and the selected product is removed
   */
  private clearSearch = () => {
    this.props.setProductList([]);
    this.props.setSelectedProduct(undefined);
    this.props.setSearchValue("");
  };

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

    this.setState({spinpls: true});
    this.props.setSearchValue(value);

    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.timeout = window.setTimeout(() => {
      this.executeProductSearch();
    }, this.SEARCH_DELAY);
  };

  /**
   * This function is managed by the onProduct search and is responsible for contacting the search service which then performs a product search.
   * @param value Input value typed by end user
   */
  private executeProductSearch = async (): Promise<void> => {
    let products = await this.searchService.getProduct(this.props.productData.searchValue);
    this.props.setProductList(products);
    this.setState({spinpls: false});
  };
}

export default connect(
  state => state,
  { setProductList, setSelectedProduct, setSearchValue }
)(ProductSearch);
