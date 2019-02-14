import React from "react";
import styles from "./ThreeDimensionalMap.module.scss";

export interface IThreeDimensionalMapProps {

}

export interface IThreeDimensionalMapState {

}

export default class ThreeDimensionalMap extends React.Component<IThreeDimensionalMapProps, IThreeDimensionalMapState>{
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div className={styles.threeDimensionalMapContainer}>
                <h2>
                    3D Map
                </h2>
            </div>
        );
    }
}