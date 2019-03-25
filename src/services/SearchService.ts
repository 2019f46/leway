import axios from "axios";
import { IProduct } from "../models/ProductModel";

/**
 * This interface defined the methods used by the fake and real map service classes.
 * @param getProduct This method is implemented in the real and fake search service. The method is responsible for getting and returning search information.
 */
export interface ISearchService {
    getProduct: (value: string) => Promise<IProduct[]>;
}

/**
 * Real searchservice. Implements method defined in the ISearchservice interface and is responsible for getting end-user search items from the backend.
 */
export default class SearchService implements ISearchService {
    public getProduct = async (value: string): Promise<IProduct[]> => {
        let obj = await axios.get("https://wayfinder-searchservice.herokuapp.com/api/search/" + value);
        let data: IProduct[] = obj.data;
        return data;
    }
}
