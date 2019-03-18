import React from "react";
import TwoDimensionalMap from "../2dmap/TwoDimensionalMap";
import ThreeDimensionalMap from "../3dmap/ThreeDimensionalMap";
import { Toggle, Spinner } from "office-ui-fabric-react";
import styles from "./MapSelector.module.scss";
import MapService, { IMapService } from "../../services/MapService";
import FakeMapService from "../../services/FakeMapService";
import { IMapModel } from "../../models/MapModel";
import BoothError from "../bootherror/BoothError";

/**
 * Properties recived by the MapSelector Component.
 * @param fakeData Optional prop, determines whether or not the map data is produced by the real or fake service.
 */
export interface IMapSelectorProps {
    fakeData?: boolean;
}

/**
 * States managed by the MapSelector Component
 * @param twoDimensions: This state is by default set to true, when false a 3D map is rendered instead of 2D. 
 * @param mapData: This state is the object to render.
 * @param dataReady: This state is by default set to false, and is set to true when the component has received mapdata from the mapservice.
 */
export interface IMapSelectorState {
    twoDimensions: boolean;
    mapData: IMapModel;
    dataReady: boolean;
}

/**
 * This Component is responsible for contacting the mapservice and getting map data.
 * When the mapdata is gathered depending on the states of the component either a 2D or 3D map.
 */
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
            dataReady: false
        };
        this.mapService = this.props.fakeData ? new FakeMapService() : new MapService();
    }

    /**
     * Standard function in all react components. This function activates the react render engine and renders the desired content.
     */
    public render(): JSX.Element {
        let map: JSX.Element = this.state.twoDimensions ?
            <TwoDimensionalMap polygonData={this.state.mapData} onEditMap={this.onEditMap} /> :
            <ThreeDimensionalMap />;
        let toggle: JSX.Element = <Toggle onText={"3D Map"}
            offText={"2D Map"} disabled={false}
            className={styles.toggleSwitch}
            onClick={this.onToggleClick} />;
        return (
            <div className={styles.mapSelectorContainer}>
                {toggle}
                {this.state.dataReady ? map : <Spinner />}
            </div>
        );
    }

    /**
     * This is a toggle button. When clicked, the state of the component switches between 2D and 3D, which in turn decides if a 2D or 3D map component is rendered.
     */
    private onToggleClick = () => {
        this.setState({ twoDimensions: !this.state.twoDimensions });
    }

    /**
     * Lifecycle react method. This method is triggered when the react component is correctly loaded into the dom. 
     */
    public async componentDidMount() {
        let data = await this.mapService.getMapData();
        if (data) {
            this.setState({ mapData: data, dataReady: true });
        }
    }

    /**
     * Method to pass on to a child component as a callback, this method is triggered when something happens in the child component. 
     */
    private onEditMap = (data: IMapModel) => {
        console.log("Map has been edited");
    }
}
