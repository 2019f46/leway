import React from "react";
import styles from "./TwoDimensionalMap.module.scss";
import Snap from "snapsvg-cjs";
import { IMapModel } from "../../models/MapModel";
import { IProduct } from "../../models/ProductModel";
import ProductSearchStore from "../../flux/ProductSearchStore";
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
            <svg id="svg" className={styles.svgMap} viewBox={"0 0 800 650"} preserveAspectRatio="none" />
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
    private generateMap = () => {
        if (this.state.mapData) {
            let snap: Snap.Paper = Snap("#svg");
            if (!snap) {
                return;
            }

            // Target red dot
            if (this.state.selectedProduct) {
                let redCircle = snap.circle(this.state.selectedProduct.location.x, this.state.selectedProduct.location.y, 5);
                redCircle.addClass(styles.target);
            }

            // products blue dots
            if (this.state.products) {
                this.state.products.forEach(product => {
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
        }
    }

    /**
     * Lifecycle method, this method is triggered when a new property(s) is(are) received.
     * React does not by default rerender when new properties are recieved.
     * @param nextProps This property are the new received properties, usually its a good ide to compare them to the current properties before triggeren a method.
     */
    public componentWillReceiveProps(nextProps: ITwoDimensionalMapProps) {
        this.setState({ mapData: nextProps.polygonData });
        this.generateMap();
    }

    public componentWillMount() {
        ProductSearchStore.on("productsChange", () => {
            this.setState({ products: ProductSearchStore.getProductsState() });
            this.generateMap();
        });
        ProductSearchStore.on("selectedProductChange", () => {
            this.setState({ selectedProduct: ProductSearchStore.getSelectedProduct() });
            this.generateMap();
        });

    }
}
