import React from "react";
import styles from "./ThreeDimensionalMap.module.scss";

/**
 * Class responsible for rendering the 3D map. This feature is not implemented which is why it is almost empty.
 */
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
