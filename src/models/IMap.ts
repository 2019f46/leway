/**
 * Interface model which defines the object model of the map.
 */
export interface IMap {
    outerPolygon: IPolygon;
    innerPolygon: IPolygon[];
}

/**
 * Interface model which defines how a polygon object is interpreted.
 */
export interface IPolygon {
    points: ICoord[];
}

/**
 * Interface model which defines how coordinates are defined.
 */
export interface ICoord {
    x: number;
    y: number;
}
