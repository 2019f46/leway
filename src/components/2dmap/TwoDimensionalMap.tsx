import React from "react";
import styles from "./TwoDimensionalMap.module.scss";

export interface ITwoDimensionalMapProps {

}

export interface ITwoDimensionalMapState {

}

export default class TwoDimensionalMap extends React.Component<ITwoDimensionalMapProps, ITwoDimensionalMapState>{
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div className={styles.twoDimensionalMapContainer}>
                <h2>
                    2D Map
                </h2>
            </div>
        );
    }
}
