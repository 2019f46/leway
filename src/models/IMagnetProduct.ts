export interface IMagnetProduct {
    productId?: string;
    guid: string;
    Name: string;
    isMagnetized: boolean;
    Weight: number;
    Location: { x: string, y: string }
}