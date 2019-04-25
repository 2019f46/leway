import React from "react";
import { connect } from "react-redux";
import Snap from "snapsvg-cjs";
import DimensionHelper from "../../helpers/DimensionHelper";
import { ICoord, IMapModel } from "../../models/MapModel";
import { IProduct } from "../../models/ProductModel";
import PathingService, { IPathingService } from "../../services/pathingService";
import styles from "./TwoDimensionalMap.module.scss";
import * as L from "leaflet";


/**
 * Properties recived by the Product Component.
 * @param polygonData Required prop, this is the map object which is rendered
 * @param onEditMap Optional prop, this prop triggers a callback in the parent component which is used when editing the map
 */
export interface ITwoDimensionalMapProps {
  polygonData: IMapModel;
  boothLocation?: ICoord | undefined;
  onEditMap?: (data: IMapModel) => void;
}

/**
 * States managed by ProductSearchComponent
 * @param mapData: This state is the received props (polygonData). This state is used for interacting and editing the map.
 */
export interface ITwoDimensionalMapState {
  mapData: IMapModel;
  mapSize: ICoord;
}

/**
 * This interface defines the props provided by the redux store.
 */
export interface IReduxProps {
  /**
   * This property is retrieved from the redux store, and is passed down when it is set.
   */
  productData: { products: IProduct[], selectedProduct: IProduct }
}

/**
 * This is required by typescript. This interface allows up to separate properties owned by the component and properties passed by redux and use them similarity
 */
type props = ITwoDimensionalMapProps & IReduxProps;

/**
 * This Component is responsible for taking in a object with polygon points and trasforming it into a interactable 2D map
 */
class TwoDimensionalMap extends React.Component<props, ITwoDimensionalMapState> {
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
    let map = (
      <div className={styles.twoDimensionalMapContainer} id="map">
        <object id="leafwrap">
          <svg
            id="svg"
            className={styles.svgMap}
            viewBox={`0 0 ${this.state.mapSize.x} ${this.state.mapSize.y}`}
          />
        </object>
      </div>
    );
    return map;
  }

  /**
   * Lifecycle react method. This method is triggered when the react component is correctly loaded into the dom.
   */
  public componentDidMount() {
    const { selectedProduct, products } = this.props.productData;
    this.generateMap(selectedProduct, products);

    var leafletmap = L.map('map', {
      crs: L.CRS.Simple
    });

    var bounds : L.LatLngBoundsExpression = [[0,0], [1000,1000]];
    var svg = document.getElementById("leafwrap");
    var image = L.imageOverlay(svg, bounds).addTo(leafletmap);
    leafletmap.fitBounds(bounds);
  }

  public componentWillReceiveProps(nextprops: props) {
    const { selectedProduct, products } = nextprops.productData;
    this.generateMap(selectedProduct, products);
  }

  /**
   * This method renders the map using the snapsvg framework.
   * An outer polygon is rendered aswell as the inner polygons.
   */
  private generateMap = (selectedProduct: IProduct | undefined, products: IProduct[] | undefined) => {
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
      let path = this.pathingService.calculatePath(selectedProduct.location, mapSize, boothLocation, innerPolygon);
      snap.path("M" + path).addClass(styles.elPath);
    }
  }
}

export default connect((state: ITwoDimensionalMapState) => state)(TwoDimensionalMap);
