import MapService, { IMapService } from "../services/MapService";
import { IMapModel } from "../components/models/MapModel";
import FakeMapService from "../services/FakeMapService";
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";

it("Fake MapService gets data", async () => {
    let service: IMapService;
    service = new FakeMapService();

    let expected = await service.getMapData();
    let result: IMapModel = {
        outerPolygon: { polygon: [{ x: 0, y: 0 }, { x: 0, y: 65 }, { x: 80, y: 65 }, { x: 80, y: 0 }] },
        innerPolygon: [
            {
                polygon: [
                    { x: 5, y: 15 }, { x: 15, y: 15 }, { x: 17, y: 7 }, { x: 15, y: 10 }, { x: 5, y: 10 }, { x: 2, y: 7 }],
            },
            {
                polygon: [
                    { x: 25, y: 5 }, { x: 30, y: 5 }, { x: 30, y: 15 }, { x: 25, y: 15 }]
            },
            {
                polygon: [
                    { x: 5, y: 20 }, { x: 35, y: 20 }, { x: 35, y: 35 }, { x: 5, y: 35 }]
            },
            {
                polygon: [
                    { x: 45, y: 15 }, { x: 75, y: 15 }, { x: 75, y: 7 }, { x: 45, y: 10 }]
            },
            {
                polygon: [
                    { x: 45, y: 35 }, { x: 70, y: 55 }, { x: 60, y: 60 }, { x: 45, y: 40 }]
            },
            {
                polygon: [
                    { x: 5, y: 50 }, { x: 35, y: 50 }, { x: 35, y: 40 }, { x: 5, y: 40 }]
            },
            {
                polygon: [
                    { x: 40, y: 25 }, { x: 75, y: 26 }, { x: 75, y: 30 }, { x: 75, y: 50 }]
            },
        ]
    };

    expect(expected).toEqual(result);
});

it("Mapservice uses endpoint from .env  file", async () => {
    let service: IMapService;
    service = new MapService();

    let mock = new MockAdapter(Axios);

    let expected: IMapModel = {
        outerPolygon: { polygon: [{ x: 0, y: 0 }, { x: 0, y: 65 }, { x: 80, y: 65 }, { x: 80, y: 0 }] },
        innerPolygon: [
            {
                polygon: [
                    { x: 5, y: 15 }, { x: 15, y: 15 }, { x: 17, y: 7 }, { x: 15, y: 10 }, { x: 5, y: 10 }, { x: 2, y: 7 }],
            },
            {
                polygon: [
                    { x: 25, y: 5 }, { x: 30, y: 5 }, { x: 30, y: 15 }, { x: 25, y: 15 }]
            },
            {
                polygon: [
                    { x: 5, y: 20 }, { x: 35, y: 20 }, { x: 35, y: 35 }, { x: 5, y: 35 }]
            },
            {
                polygon: [
                    { x: 45, y: 15 }, { x: 75, y: 15 }, { x: 75, y: 7 }, { x: 45, y: 10 }]
            },
            {
                polygon: [
                    { x: 45, y: 35 }, { x: 70, y: 55 }, { x: 60, y: 60 }, { x: 45, y: 40 }]
            },
            {
                polygon: [
                    { x: 5, y: 50 }, { x: 35, y: 50 }, { x: 35, y: 40 }, { x: 5, y: 40 }]
            },
            {
                polygon: [
                    { x: 40, y: 25 }, { x: 75, y: 26 }, { x: 75, y: 30 }, { x: 75, y: 50 }]
            },
        ]
    };

    mock.onGet("targeturl...").reply(200, expected);

    let result = await service.getMapData();

    expect(result).toEqual(expected);
});

