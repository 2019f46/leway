import MapService, { IMapService } from "../services/MapService";
import FakeMapService from "../services/fakes/FakeMapService";
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { IMapModel } from "../models/MapModel";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";

configure({ adapter: new Adapter() });

describe("MapService", () => {

    it("MapService - Fake MapService gets data", async () => {
        let service: IMapService;
        service = new FakeMapService();

        let expected = await service.getMapData();
        let result: IMapModel = {
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

        expect(expected).toEqual(result);
    });

    it("MapService - Mapservice uses returns data correctly", async () => {
        let service: IMapService;
        service = new MapService();

        let mock = new MockAdapter(Axios);

        let expected: IMapModel = {
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

        mock.onGet("https://www.endpoint.com/_api/get").reply(200, expected);

        let result = await service.getMapData();

        expect(result).toEqual(expected);
    });
});
