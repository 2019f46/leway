import { delay } from "q";
import { IMap } from "../../models/IMap";
import { IMapService } from "../MapService";

/**
 * This service class is responsible for rendered a fake model of a map.
 * The implemented metjods are defined in the IMapService Interface. 
 */
export default class FakeMapService implements IMapService {
    public getMapData = async (): Promise<IMap> => {
        let fakeData: IMap = {
            outerPolygon: { points: [{ x: 0, y: 0 }, { x: 0, y: 650 }, { x: 800, y: 650 }, { x: 800, y: 0 }] },
            innerPolygon: [
                {
                    points: [
                        { x: 50, y: 150 }, { x: 150, y: 150 }, { x: 175, y: 75 }, { x: 150, y: 100 }, { x: 50, y: 100 }, { x: 25, y: 75 }]
                },
                {
                    points: [
                        { x: 250, y: 50 }, { x: 300, y: 50 }, { x: 300, y: 150 }, { x: 250, y: 150 }]
                },
                {
                    points: [
                        { x: 50, y: 200 }, { x: 350, y: 200 }, { x: 350, y: 350 }, { x: 50, y: 350 }]
                },
                {
                    points: [
                        { x: 450, y: 150 }, { x: 750, y: 150 }, { x: 755, y: 75 }, { x: 450, y: 100 }]
                },
                {
                    points: [
                        { x: 450, y: 350 }, { x: 700, y: 550 }, { x: 600, y: 600 }, { x: 450, y: 400 }]
                },
                {
                    points: [
                        { x: 50, y: 500 }, { x: 350, y: 500 }, { x: 350, y: 400 }, { x: 50, y: 400 }]
                },
                {
                    points: [
                        { x: 400, y: 250 }, { x: 750, y: 260 }, { x: 750, y: 300 }, { x: 750, y: 500 }]
                },
            ]
        };
        await delay("", 1000);
        return fakeData;
    }
}
