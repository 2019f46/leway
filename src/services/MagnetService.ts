import Axios from "axios";
import { IMagnetProduct } from "../models/IMagnetProduct";

/**
 * This interface defines the methods contained in the MagnetService
 */
export interface IMagnetService {
    /**
     * Get all the products which are magnetic
     */
    getMagneticProducts: () => Promise<IMagnetProduct[]>;

    /**
     * Gets all the roducts
     */
    getAllProducts: () => Promise<IMagnetProduct[]>;

    /**
     * Gets a single product based on id
     * @param guid The id of the product
     */
    getProduct: (guid: string) => Promise<IMagnetProduct>;

    /**
     * Delete a product based on id
     * @param id Id of the product
     */
    deleteProduct: (id: string) => Promise<void>;

    /**
     * Updates a product
     * @param id Id of product to update
     * @param product new product
     */
    updateProduct: (id: string, product: IMagnetProduct) => Promise<void>;

    /**
     * Adds a new product to the database
     * @param product The new product. obs. Productid is automatically set. 
     */
    addProduct: (product: IMagnetProduct) => Promise<void>;
}

/**
 * This class implements the interface IMagneticService.
 */
export default class MagnetService implements IMagnetService {
    public getMagneticProducts = async (): Promise<IMagnetProduct[]> => {
        let response = await Axios.get("https://magnetizer20190429034033.azurewebsites.net/magnetonly");
        let result: IMagnetProduct[] = await response.data;
        return result;
    }

    public getAllProducts = async (): Promise<IMagnetProduct[]> => {
        let response = await Axios.get("https://magnetizer20190429034033.azurewebsites.net/api/products");
        let result: IMagnetProduct[] = await response.data;
        return result;
    }

    public getProduct = async (guid: string): Promise<IMagnetProduct> => {
        let response = await Axios.get(`https://magnetizer20190429034033.azurewebsites.net/api/products/${guid}`);
        let result: IMagnetProduct = await response.data;
        return result;
    }

    public addProduct = async (product: IMagnetProduct): Promise<void> => {
        await Axios.post(`https://magnetizer20190429034033.azurewebsites.net/api/products`, product);
    }

    public deleteProduct = async (id: string): Promise<void> => {
        await Axios.delete(`https://magnetizer20190429034033.azurewebsites.net/api/products/${id}`);
    }

    public updateProduct = async (id: string, product: IMagnetProduct): Promise<void> => {
        await Axios.put(`https://magnetizer20190429034033.azurewebsites.net/api/products/${id}`, product);
    }
}
