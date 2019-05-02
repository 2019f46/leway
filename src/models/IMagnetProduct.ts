export interface IMagnetProduct {
    productId?: string;
    guid: string;
    Name: string;
    isMagnetized: boolean;
    weight: number;
    Location: { x: string, y: string }
}