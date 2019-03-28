import React from "react";
import styles from "./TwoDimensionalMap.module.scss";
import Snap from "snapsvg-cjs";
import { IMapModel, ICoord, IPolygon } from "../../models/MapModel";
import { IProduct } from "../../models/ProductModel";
import ProductSearchStore from "../../flux/ProductSearchStore";
import pathfinder from "pathfinding";
import MapService from "../../services/MapService";

/**
 * Properties recived by the Product Component.
 * @param polygonData Required prop, this is the map object which is rendered
 * @param onEditMap Optional prop, this prop triggers a callback in the parent component which is used when editing the map
 */
export interface ITwoDimensionalMapProps {
  polygonData: IMapModel;
  onEditMap?: (data: IMapModel) => void;
}

/**
 * States managed by ProductSearchComponent
 * @param mapData: This state is the received props (polygonData). This state is used for interacting and editing the map.
 */
export interface ITwoDimensionalMapState {
  mapData: IMapModel;
  mapSize: ICoord;
  products?: IProduct[];
  selectedProduct?: IProduct;
}

/**
 * This Component is responsible for taking in a object with polygon points and trasforming it into a interactable 2D map
 */
export default class TwoDimensionalMap extends React.Component<ITwoDimensionalMapProps, ITwoDimensionalMapState> {
  constructor(props: any) {
    super(props);
    this.state = {
      mapData: this.props.polygonData,
      mapSize: this.findDimensions(this.props.polygonData.outerPolygon)
    };
  }

  /**
   * Standard function in all react components. This function activates the react render engine and renders the desired content.
   */
  public render(): JSX.Element {
    let map = (
      <div className={styles.twoDimensionalMapContainer}>
        <svg
          id="svg"
          className={styles.svgMap}
          viewBox={`0 0 ${this.state.mapSize.x} ${this.state.mapSize.y}`}
          preserveAspectRatio="none"
        />
      </div>
    );
    return map;
  }

  /**
   * Lifecycle react method. This method is triggered when the react component is correctly loaded into the dom.
   */
  public componentDidMount() {
    this.generateMap();
  }

  /**
   * This method renders the map using the snapsvg framework.
   * An outer polygon is rendered aswell as the inner polygons.
   */
  private generateMap = (selectedProduct: IProduct | undefined = undefined, products: IProduct[] | undefined = this.state.products) => {
    let snap: Snap.Paper = Snap("#svg");
    if (!snap) {
      return;
    }

    let container = document.getElementById("svg");
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }

    // Target red dot
    if (selectedProduct && selectedProduct.location) {
      let redCircle = snap.circle(
        selectedProduct.location.x,
        selectedProduct.location.y,
        5
      );
      redCircle.addClass(styles.target);
    }

    // products blue dots
    if (products && products.length > 0) {
      let filter = products.filter(prod => {
        if (JSON.stringify(prod) !== JSON.stringify(selectedProduct)) {
          return prod;
        }
      });
      filter.forEach(product => {
        if (product.location) {
          let bluecircle = snap.circle(
            product.location.x,
            product.location.y,
            5
          );
          bluecircle.addClass(styles.products);
        }
      });
    }

    if (
      !this.state.mapData.outerPolygon.points.length ||
      this.state.mapData.outerPolygon.points.length < 1
    ) {
      return;
    }
    // Process outer polygon
    let polygon: string = "";
    this.state.mapData.outerPolygon.points.forEach(coord => {
      polygon += `${coord.x}, ${coord.y} `;
    });

    snap.polygon(polygon as any);

    // Reset the string container
    polygon = "";

    // Iterate all inner polygons
    this.state.mapData.innerPolygon.forEach(it => {
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

    if (selectedProduct && selectedProduct.location) {
      this.calculatePath(
        snap,
        selectedProduct.location.x,
        selectedProduct.location.y
      );
    }
  }

  /**
   * This method will calculate the shortest path fron your current location to the selected item.
   * @param snap Snap is the snap svg object which populates the entire svg
   * @param x1 Target location x coord
   * @param y1 Target location y coord
   */
  private calculatePath = (snap: Snap.Paper, x1: number, y1: number) => {
    let finder = new pathfinder.AStarFinder({ diagonalMovement: 4 });

    let emptyGrid = new pathfinder.Grid(
      this.state.mapSize.x + 1,
      this.state.mapSize.y + 1
    );

    // Define where you cant move
    this.setUnwalkable(emptyGrid);

    // Calculate the path to take
    let rawPath = finder.findPath(0, 0, x1, y1, emptyGrid);

    // Smooth out the path
    let smoothPath = pathfinder.Util.smoothenPath(emptyGrid, rawPath);

    // Render & animate the path
    snap.path("M" + smoothPath).addClass(styles.elPath);
  }

  /**
   * The purpose of this method is to set the grid coordinates which are unavailable for pathfinding
   * @param grid The invisible grid which controls areas where you can move and areas where you cant
   */
  private setUnwalkable = (grid: pathfinder.Grid) => {
    // Iterate each polygon set
    this.props.polygonData.innerPolygon.forEach(pol => {
      for (let i = 0; i < pol.points.length; i++) {
        // points to compare
        let comp1 = pol.points[i];
        let comp2 = pol.points[i + 1];

        // If there are no more points to compare, compare to the initial point
        if (!comp2) {
          comp2 = pol.points[0];
        }

        this.setUnpathableZones(comp1, comp2, grid);
      }
    });
  }

  /**
   * This is my implementation of Bresenham algorithm, which determines the coordinates in the path of a vector in real numbers
   * http://www.javascriptteacher.com/bresenham-line-drawing-algorithm.html
   */
  private setUnpathableZones = (coord: ICoord, coord1: ICoord, grid: pathfinder.Grid) => {
    // Pull the coordinates
    let x0 = coord.x;
    let y0 = coord.y;
    let x1 = coord1.x;
    let y1 = coord1.y;

    // Calculate the absolute Values
    let absX = Math.abs(x1 - x0);
    let absY = Math.abs(y1 - y0);

    // Determine which value is greater to know the directing in which to look and iterate through it 1 point at a time
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;

    let errFactor = absX - absY;

    while (true) {
      grid.setWalkableAt(x0, y0, false);

      if (x0 === x1 && y0 === y1) {
        break;
      }
      let e2 = 2 * errFactor;
      if (e2 > -absY) {
        errFactor -= absY;
        x0 += sx;
      }
      if (e2 < absX) {
        errFactor += absX;
        y0 += sy;
      }
    }
  }

  /**
   * Finds the dimensions of a polygon
   * from 0,0 to the largest x and y
   * @param polygon the outer polygon
   * @returns A coordinate object, that contains the length and height of the polygon
   */
  public findDimensions(polygon: IPolygon): ICoord {
    let lx: number = 0;
    let ly: number = 0;

    polygon.points.forEach(coord => {
      if (coord.x > lx) {
        lx = coord.x;
      }
      if (coord.y > ly) {
        ly = coord.y;
      }
    });

    return { x: lx, y: ly };
  }

  /**
   * When the component mounts, a listener will be listening to the prodsStateChange event which is emited by the product search store.
   * This event will enable this component to know the current searchresults without being coupled with the productSearch component.
   */
  public componentWillMount() {
    ProductSearchStore.on("prodsStateChange", this.onSelectedChange);
  }

  // This is the method which runs when the event prodsStateChange is emited.
  private onSelectedChange = () => {
    let selected = ProductSearchStore.getSelectedProduct();
    let prods = ProductSearchStore.getProductsState();
    this.setState({ selectedProduct: selected, products: prods });
    this.generateMap(selected, prods);
  }
}
