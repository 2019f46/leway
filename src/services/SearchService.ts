import axios from "axios";
import { ISearchModel } from "../models/ProductModel";

export interface ISearchService {
    getProduct: (value: string) => Promise<ISearchModel>;
}

export default class SearchService implements ISearchService {
    public getProduct = async (value: string): Promise<ISearchModel> => {
        let obj = await axios.get("https://www.endpoint.com/_api/get");
        let data: ISearchModel = obj.data;
        return data;
    }
}