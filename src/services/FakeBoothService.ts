import { IBooth } from "../models/IBooth";
import { IBoothService } from "./BoothService";
import { Guid } from "guid-typescript";

export default class FakeBoothService implements IBoothService {
    public saveBooth = () => {
        let guid = Guid.create().toString();
        window.localStorage.setItem("boothId", guid);
    }

    public saveCoords = () => {
        console.log("Location has been saved to db");
    }

    public getBooth = (): IBooth | undefined => {
        let id = window.localStorage.getItem("boothId");
        if (id) {
            let booth: IBooth = {
                boothId: id,
                x: 200,
                y: 400
            };

            return booth;
        }
        return undefined;
    }
}

