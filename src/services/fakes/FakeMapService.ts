import { IMapService } from "../MapService";
import { IMapModel } from "../../models/MapModel";
import { delay } from "q";

/**
 * This service class is responsible for rendered a fake model of a map.
 * The implemented metjods are defined in the IMapService Interface. 
 */
export default class FakeMapService implements IMapService {
    public getMapData = async (): Promise<IMapModel> => {
        let fakeData: IMapModel = {
            outerPolygon: { polygon: [{ x: 0, y: 0 }, { x: 0, y: 650 }, { x: 800, y: 650 }, { x: 800, y: 0 }] },
            innerPolygon: [
                {
                    polygon: [
                        { x: 50, y: 150 }, { x: 150, y: 150 }, { x: 175, y: 75 }, { x: 150, y: 100 }, { x: 50, y: 100 }, { x: 25, y: 75 }]
                },
                {
                    polygon: [
                        { x: 250, y: 50 }, { x: 300, y: 50 }, { x: 300, y: 150 }, { x: 250, y: 150 }]
                },
                {
                    polygon: [
                        { x: 50, y: 200 }, { x: 350, y: 200 }, { x: 350, y: 350 }, { x: 50, y: 350 }]
                },
                {
                    polygon: [
                        { x: 450, y: 150 }, { x: 750, y: 150 }, { x: 755, y: 75 }, { x: 450, y: 100 }]
                },
                {
                    polygon: [
                        { x: 450, y: 350 }, { x: 700, y: 550 }, { x: 600, y: 600 }, { x: 450, y: 400 }]
                },
                {
                    polygon: [
                        { x: 50, y: 500 }, { x: 350, y: 500 }, { x: 350, y: 400 }, { x: 50, y: 400 }]
                },
                {
                    polygon: [
                        { x: 400, y: 250 }, { x: 750, y: 260 }, { x: 750, y: 300 }, { x: 750, y: 500 }]
                },
            ]
        };
        // let fakeData: IMapModel = {
        //     outerPolygon: { polygon: [{ x: 0, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 0 }] },
        //     innerPolygon: [
        //         {
        //             polygon: [
        //                 { x: 0, y: 1 }, { x: 1, y: 8 }, { x: 2, y: 8 }, { x: 2, y: 7 },
        //                 { x: 2, y: 2 }, { x: 7, y: 2 }, { x: 7, y: 7 },
        //                 { x: 5, y: 7 }, { x: 5, y: 4 }, { x: 4, y: 4 }, { x: 4, y: 8 }, { x: 5, y: 8 },
        //                 { x: 8, y: 8 }, { x: 8, y: 1 }
        //             ],
        //             // polygon: [
        //             //     { x: 2, y: 1 }, { x: 1, y: 8 }, { x: 2, y: 8 }, { x: 2, y: 7 },
        //             //     { x: 3, y: 2 }, { x: 8, y: 2 }, { x: 7, y: 7 },
        //             //     { x: 5, y: 7 }, { x: 6, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 8 }, { x: 5, y: 8 },
        //             //     { x: 7, y: 8 }, { x: 9, y: 1 }
        //             // ]
        //         },
        //     ]
        // };
        await delay("", 1000);
        return fakeData;
    }
}
