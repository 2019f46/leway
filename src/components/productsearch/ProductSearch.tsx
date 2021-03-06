import { SearchBox, Spinner } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { IProduct } from "../../models/IProduct";
import { setProductList, setSearchValue, setSelectedProduct } from "../../redux/productsearch/ProductSearchActions";
import Product from "../product/Product";
import styles from "./ProductSearch.module.scss";

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
  setProductList: (query?: string, fake?: boolean) => void;
  /** Set the selected product in the redux store */
  setSelectedProduct: (product: IProduct | undefined) => void;
  /** Set the searched value */
  setSearchValue: (value: string) => void;
  /** State of the redux store */
  productData?: { products: IProduct[]; selectedProduct: IProduct; searchValue: string; };
}

/** Combined redux and ProductSearch properties */
type combinedProps = IProductSearchProps & IReduxProps;

interface IProductSearchState {
  spinner: boolean;
}

/**
 * This component is responsible for handling the search functionality of the application.
 * This component is self contained which means that the component contains all the logic search logic.
 * From the rendering of the Searchbox (subcomponent) to managing the logic of how the search results are handled and shown.
 */
class ProductSearch extends React.Component<combinedProps, IProductSearchState> {
  private timeout: any;
  private SEARCH_DELAY = 1000;
  constructor(props: any) {
    super(props);
    this.state = { spinner: false };
  }

  /**
   * Standard function in all react components. This function activates the react render engine and renders the desired content.
   */
  public render(): JSX.Element {
    let searchResults: JSX.Element[] = [];
    let selectedProduct, products, searchValue;

    if (this.props.productData) {
      selectedProduct = this.props.productData.selectedProduct;
      products = this.props.productData.products;
      searchValue = this.props.productData.searchValue;
    }

    let searchBox: JSX.Element = (<div className={selectedProduct ? styles.searchBoxContainer : undefined}        >
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
    </div>);

    if (!selectedProduct && products && products.length > 0) {
      products.forEach(element => {
        searchResults.push(
          <Product
            product={element}
            onProductClick={this.onProductClick}
            key={element.id}
          />
        );
      });
    }

    if (selectedProduct) {
      searchResults.push(<div key={selectedProduct.id}>
        {selectedProduct ? (<Product product={selectedProduct} chosen={true} />) : (searchResults)}
      </div>);
    }

    return (
      <div className={styles.productSearchContainer}>
        {searchBox}
        <div className={styles.products}>
          {searchResults}
        </div>

        {this.state.spinner ? <Spinner style={{ marginTop: "5px" }} /> : undefined}
      </div>
    );
  }

  /**
   * This method is called when clicking the icon on the searchbox when the selected product state is set.
   * This method handles the transition from a single product item to showing the rpevios list of products.
   */
  private onBackIconClick = () => {
    if (this.props.productData && this.props.productData.selectedProduct) {
      this.props.setSelectedProduct(undefined);
    }
  }

  /**
   * This method is called when a list is products is rendered, and a product is selected by the end user.
   * This methods sets the state of the selected product which then changes the view from a list of products to a single product.
   * @param product The selected product
   */
  private onProductClick = (product: IProduct) => {
    this.props.setSelectedProduct(product);
  }

  /**
   * When clearing the searchbox, any earlier search results are removed from the component state, and the selected product is removed
   */
  private clearSearch = () => {
    this.props.setProductList();
    this.props.setSelectedProduct(undefined);
    this.props.setSearchValue("");
  }

  /**
   * This function handlers what happens when the end-user types into the search box.
   * If the usuer continiously types, no search is performed, but
   * if the user has not performed a keypress in the last 1000ms, a search is performed.
   * This function does not directly perform a product search, instead it calls on the function exrcuteProductSearch.
   * @param value Input value typed by end user
   */
  private onProductSearch = async (value: string): Promise<void> => {

    // If string is empty
    // Clear the search and cancel the timeout
    // Might be because user deleted search query
    if (!value) {
      this.clearSearch();
      window.clearTimeout(this.timeout);
      return;
    }

    // If a product has been chosen, but user starts to type again
    // deselct the chosen item
    if (this.props.productData && this.props.productData.selectedProduct !== undefined) {
      this.props.setSelectedProduct(undefined);
    }

    this.props.setSearchValue(value);

    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.timeout = window.setTimeout(() => {
      this.executeProductSearch(value);
    }, this.SEARCH_DELAY);
  }

  public componentWillReceiveProps(props: combinedProps) {
    if ((props.productData && props.productData.products) || (props.productData && props.productData.selectedProduct)) {
      this.setState({ spinner: false });
    }
  }

  /**
   * This function is managed by the onProduct search and is responsible for contacting the search service which then performs a product search.
   * @param value Input value typed by end user
   */
  private executeProductSearch = async (value: string): Promise<void> => {
    this.setState({ spinner: true });
    this.props.setProductList(value, this.props.fakeData);
  }
}

export default connect(state => state, { setProductList, setSelectedProduct, setSearchValue })(ProductSearch);
