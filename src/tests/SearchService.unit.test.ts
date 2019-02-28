import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
import SearchService, { ISearchService } from "../services/SearchService";
import FakeSearchService from "../services/FakeSearchService";
import { ISearchModel } from "../models/ProductModel";
const env = require("dotenv").config();


it("SearchService - Fake SearchService gets data", async () => {
    let service: ISearchService;
    service = new FakeSearchService();
    let seachText = "King size bed";

    let expected = await service.getProduct(seachText);

    let result: ISearchModel[] = [{
        id: "2127b7f6-9d6b-4c61-a38b-5bc673bbd0fd",
        location: { x: 100, y: 100 },
        name: seachText,
        quantity: 55,
    }];

    expect(expected).toEqual(result);
});

it("SearchService - SearchService returns data correctly", async () => {
    let service: ISearchService;
    service = new SearchService();
    let seachText = "King size bed";
    let mock = new MockAdapter(Axios);

    let expected: ISearchModel[] = [{
        id: "2127b7f6-9d6b-4c61-a38b-5bc673bbd0fd",
        location: { x: 100, y: 100 },
        name: seachText,
        quantity: 55,
    }];

    mock.onGet("https://www.endpoint.com/_api/get").reply(200, expected);

    let result = await service.getProduct(seachText);

    expect(result).toEqual(expected);
});

