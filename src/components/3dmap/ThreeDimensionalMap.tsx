import React from "react";
import styles from "./ThreeDimensionalMap.module.scss";


export default class ThreeDimensionalMap extends React.Component {
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
