import React from "react";
import styles from "./Home.module.scss";
import MapSelector from "./mapselector/MapSelector";
import SearchPanel from "./searchpanel/SearchPanel";

/**
 * This is one of the component at the top of the component tree. 
 * This component is responsible for rendeing the home page.
 * The entire homepage is contained within this component. 
 */
export default class Home extends React.Component {
    /**
     * Standard function in all react components. This function activates the react render engine and renders the desired content.
     */
    public render() {
        let selector: JSX.Element = <MapSelector />;
        let panel: JSX.Element = <SearchPanel/>;
        return (<div className={styles.homeContainer}>
            {panel}
            {selector}
        </div>);
    }
}
