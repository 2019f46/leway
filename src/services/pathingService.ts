import pathfinder from "pathfinding";
import { IMagnetProduct } from "../models/IMagnetProduct";
import { ICoord, IPolygon } from "../models/IMap";
import { ILocation } from "../models/IProduct";
import MagnetService, { IMagnetService } from "./MagnetService";

/**
 * This interface defines the methods used by the pathingservice.
 */
export interface IPathingService {
    /**
     * This method will calculate the shortest path fron your current location to the selected item.
     * @param targetLocation x and y coordinates of route target location.
     * @param mapsize Height and width of the map.
     * @param boothLocation The location of the booth which is the start point of the route.
     * @param innerPolygon The polygons which the map contains. These are the obstacles the this pathing service must avoid.
     */
    calculatePath: (targetLocation: ILocation, mapsize: ICoord, boothLocation: ICoord | undefined, innerPolygon: IPolygon[]) => Promise<Array<number[][]>>;
}

/**
 * Pathing service Implements method defined in the IPathingService interface and is responsible for calculating paths
 */
export default class PathingService implements IPathingService {
    private magnetService: IMagnetService = new MagnetService();

    public calculatePath = async (targetLocation: ILocation, mapsize: ICoord, boothLocation: ICoord | undefined, innerPolygon: IPolygon[]): Promise<Array<number[][]>> => {
        let finder = new pathfinder.AStarFinder({ diagonalMovement: 4 });

        let emptyGrid = new pathfinder.Grid(
            mapsize.x + 1,
            mapsize.y + 1
        );

        // Define where you cant move
        this.setUnwalkable(emptyGrid, innerPolygon);

        // Calculate the path to take
        let bloc = boothLocation ? boothLocation : { x: 0, y: 0 };


        let shortestLength = this.calculateLength(bloc, targetLocation);
        let alternative = await this.selectPath(bloc, targetLocation);

        let smoothedPath: any[] = [];

        if (alternative && shortestLength * alternative.path.weight > alternative.length) {
            let targetX = parseInt(alternative.path.location.x);
            let targetY = parseInt(alternative.path.location.y);

            finder.findPath(bloc.x, bloc.y, targetX, targetY, emptyGrid);
            let rawPath = finder.findPath(targetX, targetY, targetLocation.x, targetLocation.y, emptyGrid);

            smoothedPath.push(pathfinder.Util.smoothenPath(emptyGrid, rawPath));
            return smoothedPath;
        } else {
            let rawPath = finder.findPath(bloc.x, bloc.y, targetLocation.x, targetLocation.y, emptyGrid);
            smoothedPath.push(pathfinder.Util.smoothenPath(emptyGrid, rawPath));
            return smoothedPath;
        }
    }

    private selectPath = async (start: ICoord, end: ICoord) => {

        let magnetizedItems = await this.magnetService.getMagneticProducts();
        let filteredItems = magnetizedItems.filter(item => {
            if (item.weight > 1) {
                return item;
            }
        });

        let selectedPath: { path: IMagnetProduct, length: number } = undefined as any;

        filteredItems.forEach(path => {
            let firstHalf = this.calculateLength(start, { x: parseInt(path.location.x), y: parseInt(path.location.y) });
            let secondHalf = this.calculateLength({ x: parseInt(path.location.x), y: parseInt(path.location.y) }, end);
            let totalLength = firstHalf + secondHalf;

            if (!selectedPath || totalLength < selectedPath.length) {
                selectedPath = { length: totalLength, path: path }
            }
        });

        return selectedPath;

        // if (shortestLength * selectedPath.path.weight > selectedPath.length) {
        //     let targetX = parseInt(selectedPath.path.location.x);
        //     let targetY = parseInt(selectedPath.path.location.y);

        //     let rawPath1 = finder.findPath(start.x, start.y, 99, 1, emptyGrid);
        //     let rawPath2 = finder.findPath(targetX, targetY, end.x, end.y, emptyGrid);
        //     return rawPath1;

        //     // return pathfinder.Util.smoothenPath(emptyGrid, rawPath1 + rawPath2) + pathfinder;
        // }
    }

    private calculateLength = (start: ICoord, end: ICoord) => {
        return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - end.x, 2));
    }

    /**
     * The purpose of this method is to set the grid coordinates which are unavailable for pathfinding
     * @param grid The invisible grid which controls areas where you can move and areas where you cant
     * @param innerPolygon The polygons which the map contains. These are the obstacles the this pathing service must avoid.
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
