import React from "react";
import MapSelector from "./mapselector/MapSelector";
import ProductSearch from "./productsearch/ProductSearch";
import styles from "./Home.module.scss";

export default class Home extends React.Component {
    public render() {
        let selector: JSX.Element = <MapSelector fakeData={true} />;
        let prodSearch: JSX.Element = <ProductSearch fakeData={true} />;
        return (<div className={styles.homeContainer}>
            {prodSearch}
            {selector}
        </div>);
    }
}
