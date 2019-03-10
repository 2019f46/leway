import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
import SearchService, { ISearchService } from "../services/SearchService";
import FakeSearchService from "../services/FakeSearchService";
import { configure } from "enzyme";
// import { ISearchModel } from "../models/ProductModel";
import Adapter from "enzyme-adapter-react-16";
import { IProduct } from "../models/ProductModel";

configure({ adapter: new Adapter() });

describe("SearchService", () => {
    it("SearchService - Fake SearchService gets data", async () => {
        let service: ISearchService;
        service = new FakeSearchService();

        let seachText = "King size bed";
        let expected = await service.getProduct(seachText);

        let prod1: IProduct = {
            image: "https://cdn.shopify.com/s/files/1/0206/9470/products/southcoast-milk-1l_1024x1024.jpg?v=1494139427",
            id: "47",
            name: "Milk",
            quantity: "700",
            price: "5",
            description: "Its white",
            location: { x: 600, y: 50 }
        };

        let prod2: IProduct = {
            image: "https://7gigzxopz0uiqxo1-zippykid.netdna-ssl.com/wp-content/uploads/2015/08/cheese.jpg",
            id: "15",
            name: "Cheese",
            quantity: "100",
            price: "25",
            description: "It be smelly",
            location: { x: 500, y: 500 }
        };

        let data: IProduct[] = [prod1, prod2];

        expect(expected).toEqual(data);
    });
});
