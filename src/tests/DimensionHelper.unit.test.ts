import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import DimensionHelper from "../helpers/DimensionHelper";
configure({ adapter: new Adapter() });

describe("FindDimensions", () => {
    it("should return the largest x and y of the polygon", () => {
        let result = DimensionHelper.findDimensions({
            points: [
                { x: 0, y: 0 },
                { x: 28, y: 10 },
                { x: 1, y: 98 },
                { x: 32, y: 10 },
                { x: 25, y: 11 },
                { x: 58, y: 12 },
                { x: 21, y: 13 },
                { x: 0, y: 14 }
            ]
        });

        expect(result).toEqual({ x: 58, y: 98 });
    });
});