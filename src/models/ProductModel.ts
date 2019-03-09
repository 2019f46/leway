export interface IProduct {
    id: string;
    image: string;
    name: string;
    quantity: string;
    description: string;
    price: string;
    location: ILocation;
}

export interface ILocation {
    x: number;
    y: number;
}
