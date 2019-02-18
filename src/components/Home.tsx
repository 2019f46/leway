import React from "react";
import MapSelector from "./mapselector/MapSelector";

export default class Home extends React.Component {
    public render() {
        let selector: JSX.Element = <MapSelector />;
        return (
            <div>
                {selector}
            </div>
        );
    }
}
