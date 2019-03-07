import axios from "axios";
import { IMapModel } from "../models/MapModel";

/**
 * This interface defined the methods used by the fake and real map service classes.
 * @param getmapData This method is implemented in the real and fake map service. The method is responsible for getting map information
 */
export interface IMapService {
    getMapData: () => Promise<IMapModel>;
}

/**
 * Real mapservice. Implements method defined in the IMapService interface and is responsible for getting map data from the backend.
 */
export default class MapService implements IMapService {
    public getMapData = async (): Promise<IMapModel> => {
        let obj = await axios.get("https://www.endpoint.com/_api/get");
        let data: IMapModel = obj.data;
        return data;
    }
}
