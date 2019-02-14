import React from "react";

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
            <h2>
                3D Map
            </h2>
        );
    }
}