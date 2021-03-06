import { IBooth } from "../models/IBooth";

/** This service describes the methods implemented by the BoothService
 * Due to time restrictions booth customization was not implemented.
 */
export interface IBoothService {
    saveBooth: () => void;
    getBooth: () => IBooth | undefined;
    saveCoords: (x: number, y: number) => void;
}

export default class BoothService implements IBoothService {
    public saveBooth = () => {
        // get generate guid in backend
        // save guid in local storage
    }

    public saveCoords = (x: number, y: number) => {
        // get guid from local storage
        // search for location in backend
        // return location
    }

    public getBooth = (): IBooth | undefined => {
        // get guid from local storage
        // get location frm backend using guid
        // return location
        return undefined;
    }
}
