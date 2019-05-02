import Axios from "axios";
import { IMagnetProduct } from "../models/IMagnetProduct";

export interface IMagnetService {
    getMagneticProducts: () => Promise<IMagnetProduct[]>;
    getAllProducts: () => Promise<IMagnetProduct[]>;
    getProduct: (guid: string) => Promise<IMagnetProduct>;
    deleteProduct: (id: string) => Promise<void>;
    updateProduct: (id: string, product: IMagnetProduct) => Promise<void>;
    addProduct: (product: IMagnetProduct) => Promise<void>;
}

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
