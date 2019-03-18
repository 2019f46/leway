import React from "react";
import styles from "./TwoDimensionalMap.module.scss";
import Snap, { path } from "snapsvg-cjs";
import { IMapModel } from "../../models/MapModel";
import { IProduct } from "../../models/ProductModel";
import ProductSearchStore from "../../flux/ProductSearchStore";
import pathfinder from "pathfinding";
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
            mapData: this.props.polygonData
        };
    }

    /**
     * Standard function in all react components. This function activates the react render engine and renders the desired content.
     */
    public render(): JSX.Element {
        let map = <div className={styles.twoDimensionalMapContainer}>
            <svg id="svg" className={styles.svgMap} viewBox={`0 0 ${this.props.polygonData.outerPolygon.polygon[2].x} ${this.props.polygonData.outerPolygon.polygon[2].y}`} preserveAspectRatio="none" />
        </div>;
        return (map);
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
        if (selectedProduct) {
            let redCircle = snap.circle(selectedProduct.location.x + 20, selectedProduct.location.y + 20, 5);
            redCircle.addClass(styles.target);
        }

        // products blue dots
        if (products && products.length > 0) {
            products.forEach(product => {
                let redCircle = snap.circle(product.location.x, product.location.y, 5);
                redCircle.addClass(styles.products);
            });
        }

        // Process outer polygon
        let polygon: string = "";
        this.state.mapData.outerPolygon.polygon.forEach(coord => {
            polygon += `${coord.x}, ${coord.y} `;
        });

        snap.polygon(polygon as any);

        // Reset the string container
        polygon = "";

        // Iterate all inner polygons
        this.state.mapData.innerPolygon.forEach(it => {

            // for each inner polygon
            it.polygon.forEach(coord => {
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

        this.calculatePath(snap);

    }

    private calculatePath = (snap: Snap.Paper) => {
        let finder = new pathfinder.AStarFinder({ diagonalMovement: 1 });

        let emptyGrid = new pathfinder.Grid(11, 11);
        let test = this.setUnwalkable(emptyGrid);
        let grid = finder.findPath(0, 0, 5, 5, test);

        // path Starting position
        let path = snap.path("").attr({
            fill: "none",
            stroke: "#bada55",
            strokeWidth: 0.1
        });

        let route = "M";
        grid.forEach(pt => {
            route += `${pt[0]} ${pt[1]}L`;
        });

        path.animate({ d: route }, 2000);
    }

    private setUnwalkable = (path: pathfinder.Grid): pathfinder.Grid => {
        // this.props.polygonData.innerPolygon.forEach(item => {});
        let test = path;

        // Iterate each polygon set
        this.props.polygonData.innerPolygon.forEach(pol => {
            for (let i = 0; i < pol.polygon.length; i++) {

                // points to compare
                let comp1 = pol.polygon[i];
                let comp2 = pol.polygon[i + 1];

                if (!comp2) { comp2 = pol.polygon[0]; }

                if (comp1.x === comp2.x) {
                    // x variable stays constant
                    let y = comp1.y;
                    let upwards = false;
                    if (comp2.y > comp1.y) { upwards = true; }

                    if (upwards) {
                        do {
                            test.setWalkableAt(comp1.x, y, false);
                            y++;
                        } while (y !== comp2.y);
                    } else {
                        do {
                            test.setWalkableAt(comp1.x, y, false);
                            y--;
                        } while (y !== comp2.y);
                    }

                } else if (comp1.y === comp2.y) {
                    // y stays constant
                    let x = comp1.x;
                    let upwards = false;
                    if (comp2.x > comp1.x) { upwards = true; }
                    if (upwards) {
                        do {
                            test.setWalkableAt(x, comp1.y, false);
                            x++;
                        } while (x !== comp2.x);
                    } else {
                        do {
                            test.setWalkableAt(x, comp1.y, false);
                            x--;
                        } while (x !== comp2.x);
                    }

                }
            }
        });
        return test;
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
