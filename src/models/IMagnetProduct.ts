export interface IMagnetProduct {
    productId?: string;
    guid: string;
    Name: string;
    isMagnetized: boolean;
    weight: number;
    location: { x: string, y: string }
}