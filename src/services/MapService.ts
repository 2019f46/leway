import axios, { AxiosRequestConfig } from "axios";
import { IMap } from "../models/IMap";

/**
 * This interface defined the methods used by the fake and real map service classes.
 */
export interface IMapService {
    /** This method is implemented in the real and fake map service. The method is responsible for getting map information from the backend*/
    getMapData: () => Promise<IMap>;
}

/**
 * Real mapservice. Implements method defined in the IMapService interface and is responsible for getting map data from the backend.
 */
export default class MapService implements IMapService {
    public getMapData = async (): Promise<IMap> => {
        let config: AxiosRequestConfig = {
            xsrfHeaderName: "sessionId",
        };
        let obj = await axios.get("https://wayfinder-mapservice.herokuapp.com/api/map", config);
        let data: IMap = obj.data;
        return data;
    }
}
