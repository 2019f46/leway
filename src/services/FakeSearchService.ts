import { ISearchService } from "./SearchService";
import { ISearchModel } from "../models/ProductModel";

export default class FakeSearchService implements ISearchService {
    public getProduct = async (value: string): Promise<ISearchModel> => {
        console.log("service: " + value);
        let data: ISearchModel = {
            id: "2127b7f6-9d6b-4c61-a38b-5bc673bbd0fd",
            name: "Seng",
            quantity: 55,
            location: { x: 100, y: 100 }
        };
        return data;
    }
}
