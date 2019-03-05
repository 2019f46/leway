import axios from "axios";
import { IProduct } from "../models/ProductModel";

export interface ISearchService {
    getProduct: (value: string) => Promise<IProduct[]>;
}

export default class SearchService implements ISearchService {
    public getProduct = async (value: string): Promise<IProduct[]> => {
        let obj = await axios.get("https://www.endpoint.com/_api/get");
        let data: IProduct[] = obj.data;
        return data;
    }
}
