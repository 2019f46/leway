import { ISearchService } from "./SearchService";
import { IProduct } from "../models/ProductModel";

/**
 * This service class is responsible for rendered a fake product search.
 * The implemented metjods are defined in the IMapService Interface. 
 */
export default class FakeSearchService implements ISearchService {
    public getProduct = async (value: string): Promise<IProduct[]> => {
        let prod1: IProduct = {
            image: "https://cdn.shopify.com/s/files/1/0206/9470/products/southcoast-milk-1l_1024x1024.jpg?v=1494139427",
            id: "47",
            name: "Milk",
            quantity: "700",
            price: "5",
            description: "Its white",
            location: { x: 20, y: 50 }
        };

        let prod2: IProduct = {
            image: "https://7gigzxopz0uiqxo1-zippykid.netdna-ssl.com/wp-content/uploads/2015/08/cheese.jpg",
            id: "15",
            name: "Cheese",
            quantity: "100",
            price: "25",
            description: "It be smelly",
            location: { x: 200, y: 500 }
        };

        let data: IProduct[] = [prod1, prod2];
        return data;
    }
}
