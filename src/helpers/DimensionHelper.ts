import { IPolygon, ICoord } from "../models/MapModel";

export default class DimensionHelper {

    /**
     * Finds the dimensions of a polygon
     * from 0,0 to the largest x and y
     * @param polygon the outer polygon
     * @returns A coordinate object, that contains the length and height of the polygon
     */
    public static findDimensions(polygon: IPolygon): ICoord {
        if (!polygon) { return { x: 0, y: 0 }; }

        let lx: number = 0;
        let ly: number = 0;

        polygon.points.forEach(coord => {
            if (coord.x > lx) {
                lx = coord.x;
            }
            if (coord.y > ly) {
                ly = coord.y;
            }
        });

        return { x: lx, y: ly };
    }
}