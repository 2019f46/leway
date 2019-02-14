import React from "react";

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
            <h2>
                2D Map
            </h2>
        );
    }
}