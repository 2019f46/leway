import { Spinner, Toggle } from "office-ui-fabric-react";
import React from "react";
import { IBooth } from "../../models/IBooth";
import { IMap } from "../../models/IMap";
import { IBoothService } from "../../services/BoothService";
import FakeBoothService from "../../services/fakes/FakeBoothService";
import FakeMapService from "../../services/fakes/FakeMapService";
import MapService, { IMapService } from "../../services/MapService";
import TwoDimensionalMap from "../2dmap/TwoDimensionalMap";
import ThreeDimensionalMap from "../3dmap/ThreeDimensionalMap";
import BoothError from "../bootherror/BoothError";
import styles from "./MapSelector.module.scss";

/** Interface which defines the props of MapSelector */
export interface IMapSelectorProps {
    /** Optional prop, determines whether or not the map data is produced by the real or fake service. */
    fakeData?: boolean;
}

/** Interface which defines the states of the MapSelector component */
export interface IMapSelectorState {
    /**This state is by default set to true, when false a 3D map is rendered instead of 2D */
    twoDimensions: boolean;

    /** This state is the object to render. It is not rendered here, but passed as properties to the 2d map component */
    mapData: IMap;

    /** This state is by default set to false, and is set to true when the component has received mapdata from the mapservice */
    dataReady: boolean;

    /** State to determine wether a booth error is disabled */
    disableBoothError: boolean;
}

/**
 * This Component is responsible for contacting the mapservice and getting map data.
 * When the mapdata is gathered depending on the states of the component either a 2D or 3D map.
 */
export default class MapSelector extends React.Component<IMapSelectorProps, IMapSelectorState>{
    private mapService: IMapService;
    private boothService: IBoothService;

    constructor(props: any) {
        super(props);
        this.state = {
            mapData: {
                innerPolygon: [],
                outerPolygon: { points: [] },
            },
            twoDimensions: true,
            dataReady: false,
            disableBoothError: false
        };
        this.mapService = this.props.fakeData ? new FakeMapService() : new MapService();
        this.boothService = new FakeBoothService();
    }

    /**
     * Standard function in all react components. This function activates the react render engine and renders the desired content.
     */
    public render(): JSX.Element {
        let blocation: IBooth | undefined = this.boothService.getBooth();

        let map: JSX.Element = this.state.twoDimensions ?
            <TwoDimensionalMap polygonData={this.state.mapData} onEditMap={this.onEditMap} boothLocation={blocation ? blocation.coordinates : undefined} /> :
            <ThreeDimensionalMap />;
        let toggle: JSX.Element = <Toggle onText={"3D Map"}
            offText={"2D Map"} disabled={false}
            className={styles.toggleSwitch}
            onClick={this.onToggleClick} />;
        let bError: JSX.Element = <BoothError acknowledge={this.ackMissingConfiguration} />;

        return (
            <div className={styles.mapSelectorContainer}>
                {blocation || this.state.disableBoothError ? null : bError}
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
    private onEditMap = () => {
        console.log("Map has been edited");
    }

    /**
     * Method to disable the rendering of the booth error, if the error is acknowledged
     */
    private ackMissingConfiguration = () => {
        this.setState({ disableBoothError: true });
    }
}
