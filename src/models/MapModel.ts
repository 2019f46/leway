export interface IMapModel {
    outerPolygon: IPolygon;
    innerPolygon: IPolygon[];
}

export interface IPolygon {
    polygon: ICoord[];
}
export interface ICoord {
    x: number;
    y: number;
}
