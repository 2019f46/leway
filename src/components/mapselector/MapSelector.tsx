import React from "react";
import TwoDimensionalMap from "../2dmap/TwoDimensionalMap";
import ThreeDimensionalMap from "../3dmap/ThreeDimensionalMap";
import { Toggle } from 'office-ui-fabric-react';
import styles from "./MapSelector.module.scss";

export interface IMapSelectorProps {

}

export interface IMapSelectorState {
    twoDimensions: boolean;
}

export default class MapSelector extends React.Component<IMapSelectorProps, IMapSelectorState>{
    constructor(props: any) {
        super(props);
        this.state = {
            twoDimensions: true
        }
    }

    public render(): JSX.Element {
        let map: JSX.Element = this.state.twoDimensions ? <TwoDimensionalMap /> : <ThreeDimensionalMap />;
        let toggle: JSX.Element = <Toggle
            onText={"3D Map"}
            offText={"2D Map"}
            disabled={true}
            onClick={this.onToggleClick} />
        return (
            <div className={styles.mapSelectorContainer}>
                {toggle}
                {map}
            </div>
        );
    }

    private onToggleClick = () => {
        this.setState({ twoDimensions: !this.state.twoDimensions });
    }
}