import pathfinder from "pathfinding";
import { ICoord, IPolygon } from "../models/MapModel";

/**
 * This interface defined the methods used by the fake and real map service classes.
 * @param getmapData This method is implemented in the real and fake map service. The method is responsible for getting map information
 */
export interface IPathingService {
    calculatePath: (x1: number, y1: number, mapsizeX: number, mapsyzeY: number, boothLocatiob: ICoord | undefined, innerPolygon: IPolygon[]) => void;
    // setUnwalkable: (grid: pathfinder.Grid) => void;
    // setUnpathableZones: (coord: ICoord, coord1: ICoord, grid: pathfinder.Grid) => void;
}

/**
 * Real mapservice. Implements method defined in the IMapService interface and is responsible for getting map data from the backend.
 */
export default class PathingService implements IPathingService {
    /**
     * This method will calculate the shortest path fron your current location to the selected item.
     * @param snap Snap is the snap svg object which populates the entire svg
     * @param x1 Target location x coord
     * @param y1 Target location y coord
     */
    public calculatePath = (x1: number, y1: number, mapsizeX: number, mapsyzeY: number, boothLocatiob: ICoord | undefined, innerPolygon: IPolygon[]) => {
        let finder = new pathfinder.AStarFinder({ diagonalMovement: 4 });

        let emptyGrid = new pathfinder.Grid(
            mapsizeX + 1,
            mapsyzeY + 1
        );

        // Define where you cant move
        this.setUnwalkable(emptyGrid, innerPolygon);

        // Calculate the path to take
        let bloc = boothLocatiob ? boothLocatiob : { x: 0, y: 0 };
        let rawPath = finder.findPath(bloc.x, bloc.y, x1, y1, emptyGrid);

        // Smooth out the path
        return pathfinder.Util.smoothenPath(emptyGrid, rawPath);
        // Render & animate the path

    }

    /**
     * The purpose of this method is to set the grid coordinates which are unavailable for pathfinding
     * @param grid The invisible grid which controls areas where you can move and areas where you cant
     */
    private setUnwalkable = (grid: pathfinder.Grid, innerPolygon: IPolygon[]) => {
        // Iterate each polygon set
        innerPolygon.forEach(pol => {
            for (let i = 0; i < pol.points.length; i++) {
                // points to compare
                let comp1 = pol.points[i];
                let comp2 = pol.points[i + 1];

                // If there are no more points to compare, compare to the initial point
                if (!comp2) {
                    comp2 = pol.points[0];
                }

                this.setUnpathableZones(comp1, comp2, grid);
            }
        });
    }

    /**
     * This is my implementation of Bresenham algorithm, which determines the coordinates in the path of a vector in real numbers
     * http://www.javascriptteacher.com/bresenham-line-drawing-algorithm.html
     */
    public setUnpathableZones = (coord: ICoord, coord1: ICoord, grid: pathfinder.Grid) => {
        // Pull the coordinates
        let x0 = coord.x;
        let y0 = coord.y;
        let x1 = coord1.x;
        let y1 = coord1.y;

        // Calculate the absolute Values
        let absX = Math.abs(x1 - x0);
        let absY = Math.abs(y1 - y0);

        // Determine which value is greater to know the directing in which to look and iterate through it 1 point at a time
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;

        let errFactor = absX - absY;

        while (true) {
            grid.setWalkableAt(x0, y0, false);

            if (x0 === x1 && y0 === y1) {
                break;
            }
            let e2 = 2 * errFactor;
            if (e2 > -absY) {
                errFactor -= absY;
                x0 += sx;
            }
            if (e2 < absX) {
                errFactor += absX;
                y0 += sy;
            }
        }
    }
}
