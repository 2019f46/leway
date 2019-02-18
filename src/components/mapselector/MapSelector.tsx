import React from "react";
import TwoDimensionalMap from "../2dmap/TwoDimensionalMap";
import ThreeDimensionalMap from "../3dmap/ThreeDimensionalMap";
import { Toggle } from "office-ui-fabric-react";
import styles from "./MapSelector.module.scss";
import MapService, { IMapService } from "../../services/MapService";
import FakeMapService from "../../services/FakeMapService";
import { IMapModel } from "../../models/MapModel";


export interface IMapSelectorProps {
    fakeData?: boolean;
}

export interface IMapSelectorState {
    twoDimensions: boolean;
    mapData: IMapModel;
}

export default class MapSelector extends React.Component<IMapSelectorProps, IMapSelectorState>{
    private mapService: IMapService;
    constructor(props: any) {
        super(props);
        this.state = {
            mapData: {
                innerPolygon: [],
                outerPolygon: { polygon: [] },
            },
            twoDimensions: true,
        };
        this.mapService = this.props.fakeData ? new FakeMapService() : new MapService();
    }

    public render(): JSX.Element {
        let map: JSX.Element = this.state.twoDimensions ? <TwoDimensionalMap /> : <ThreeDimensionalMap />;
        let toggle: JSX.Element = <Toggle
            onText={"3D Map"}
            offText={"2D Map"}
            disabled={true}
            onClick={this.onToggleClick} />;
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

    public async componentDidMount() {
        let data = await this.mapService.getMapData();
        this.setState({ mapData: data });
    }

    private onEditMap = () => {
        console.log("Map has been edited");
    }
}
