export interface ISearchModel {
    id: string;
    name: string;
    quantity: number;
    location: ILocation;
    // Lots of other stuff TBD
}

export interface ILocation {
    x: number;
    y: number;
}
