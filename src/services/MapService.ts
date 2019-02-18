import axios from "axios";
import { IMapModel } from "../models/MapModel";
const env = require("dotenv").config();

export interface IMapService {
    getMapData: () => Promise<IMapModel>;
}

export default class MapService implements IMapService {
    public getMapData = async (): Promise<IMapModel> => {
        let obj = await axios.get("https://www.endpoint.com/_api/get");
        let data: IMapModel = obj.data;
        return data;
    }
}
