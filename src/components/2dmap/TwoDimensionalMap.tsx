import React from "react";
import { connect } from "react-redux";
import Snap from "snapsvg-cjs";
import DimensionHelper from "../../helpers/DimensionHelper";
import { ICoord, IMap } from "../../models/IMap";
import { IProduct } from "../../models/IProduct";
import PathingService, { IPathingService } from "../../services/pathingService";
import GestureWrap from "../gestureWrap/GestureWrap";
import styles from "./TwoDimensionalMap.module.scss";

/** Interface which defines the properties of TwoDimensionalMap */
export interface ITwoDimensionalMapProps {
  /** @param polygonData Required prop, this is the map object which is rendered*/
  polygonData: IMap;
  /** @param polygonData Optional prop, this is the location of the booth. If this prop is not set the wayfinding wont initiate.*/
  boothLocation?: ICoord | undefined;
  /** @param onEditMap Optional prop, this prop triggers a callback in the parent component which is used when editing the map*/
  onEditMap?: (data: IMap) => void;
}

/** Interface which defines the states of TwoDimensionalMap */
export interface ITwoDimensionalMapState {
  /** This state is the received props (polygonData). This state is used for interacting and editing the map.*/
  mapData: IMap;
  /** This state, when set is equals to the size of the map.*/
  mapSize: ICoord;
}

export interface IReduxProps {
  /** This property is retrieved from the redux store, and is passed down when it is set.*/
  productData?: { products: IProduct[], selectedProduct: IProduct };
}

/**
 * This is required by typescript. This interface allows up to separate properties owned by the component and properties passed by redux and use them similarity
 */
type combinedProps = ITwoDimensionalMapProps & IReduxProps;

/**
 * This Component is responsible for taking in a object with polygon points and trasforming it into a interactable 2D map
 */
class TwoDimensionalMap extends React.Component<combinedProps, ITwoDimensionalMapState> {
  private pathingService: IPathingService;

  constructor(props: any) {
    super(props);
    this.state = {
      mapData: this.props.polygonData,
      mapSize: DimensionHelper.findDimensions(this.props.polygonData.outerPolygon)
    };

    this.pathingService = new PathingService();
  }

  /**
   * Standard function in all react components. This function activates the react render engine and renders the desired content.
   */
  public render(): JSX.Element {
    return (
      <div className={styles.twoDimensionalMapContainer}>
        <GestureWrap>
          <svg
            id="svg"
            className={styles.svgMap}
            viewBox={`0 0 ${this.state.mapSize.x} ${this.state.mapSize.y}`}
          />
        </GestureWrap>
      </div>
    );
  }

  /**
   * Lifecycle react method. This method is triggered when the react component is initially loaded into the DOM.
   */
  public async componentDidMount() {
    if (this.props.productData) {
      const { selectedProduct, products } = this.props.productData;
      await this.generateMap(selectedProduct, products);
    }
  }

  /**
   * Lifecycle react method. This method is triggered when the react component receives new properties.
   * @param nextprops Nextprops is the value of the new properties*/
  public async componentWillReceiveProps(nextprops: combinedProps) {
    if (nextprops.productData) {
      const { selectedProduct, products } = nextprops.productData;
      await this.generateMap(selectedProduct, products);
    }
  }

  /**
   * This method is reponsible for rendering the map, path and any other objects placed on the map.
   * If selected propduct is set it will render the selected product rather then the products.
   * @param selectedProduct This property has a value when a product is selected.
   * @param products This property has a value when a search has been performed and results are returned.
   */
  private generateMap = async (selectedProduct: IProduct | undefined, products: IProduct[] | undefined) => {
    let snap: Snap.Paper = Snap("#svg");
    if (!snap) {
      return;
    }

    let { outerPolygon, innerPolygon } = this.state.mapData;
    let { mapSize } = this.state;
    let { boothLocation } = this.props;

    // Clear the entire svg map
    let container = document.getElementById("svg");
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }


    // If there are no polygons to render, then dont do anything else.
    if (!outerPolygon.points || outerPolygon.points.length < 1) {
      return;
    }

    // Process outer polygon
    let polygon: string = "";
    outerPolygon.points.forEach(coord => {
      polygon += `${coord.x}, ${coord.y} `;
    });

    snap.polygon(polygon as any);

    // Reset the string container
    polygon = "";

    // Iterate all inner polygons
    innerPolygon.forEach(it => {
      // for each inner polygon
      it.points.forEach(coord => {
        // generate string with coordinates
        polygon += `${coord.x}, ${coord.y} `;
      });

      // create the polygon
      let pol: Snap.Element = snap.polygon(polygon as any);

      // style the polygon
      pol.addClass(styles.polygonObject);

      // reset the string
      polygon = "";
    });

    /**
     * Set the booth Location
     */
    if (boothLocation) {
      snap.circle(boothLocation.x, boothLocation.y, 1).addClass(styles.booth);
    }

    // Set the selected product location
    if (selectedProduct && selectedProduct.location) {
      snap.circle(selectedProduct.location.x, selectedProduct.location.y, 1).addClass(styles.target);
    }

    // products blue dots
    if (products && products.length > 0 && !selectedProduct) {
      products.forEach(product => {
        if (product.location) {
          snap.circle(product.location.x, product.location.y, 1).addClass(styles.products);
        }
      });
    }

    // PATH Should NOT be rendered if there is no booth location or product location
    if (this.props.boothLocation && selectedProduct && selectedProduct.location) {
      let path = await this.pathingService.calculatePath(selectedProduct.location, mapSize, boothLocation, innerPolygon);
      path.forEach(p => {
        snap.path("M" + p).addClass(styles.elPath);
      });
    }
  }
}

export default connect((state: ITwoDimensionalMapState) => state)(TwoDimensionalMap);
