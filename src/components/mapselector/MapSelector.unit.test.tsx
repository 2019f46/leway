import React from "react";
import MapSelector from "./MapSelector";
import { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import TwoDimensionalMap from "../2dmap/TwoDimensionalMap";
import ThreeDimensionalMap from "../3dmap/ThreeDimensionalMap";

// automatically unmount and cleanup DOM after the test is finished.
configure({ adapter: new Adapter() });

describe("MapSelector", () => {

    it("MapSelector - Initial state of twodimensions is set to true", () => {
        const wrapper = shallow(
            <MapSelector fakeData={true} />
        );

        expect(wrapper.state("twoDimensions")).toEqual(true);
        wrapper.unmount();
    });

    it("MapSelector - 3D map is rendered on twodimensions state equals false", () => {
        const wrapper = shallow(
            <MapSelector fakeData={true} />
        );

        wrapper.setState({ twoDimensions: false, dataReady: true });
        expect(wrapper.find(ThreeDimensionalMap)).toHaveLength(1);
        wrapper.unmount();
    });

    it("MapSelector - No map is rendered if the data is not ready", () => {
        const wrapper = shallow(
            <MapSelector fakeData={true} />
        );

        wrapper.setState({ twoDimensions: false, dataReady: false });
        expect(wrapper.find(ThreeDimensionalMap)).toHaveLength(0);
        wrapper.unmount();
    });

    it("MapSelector - 2D map is NOT rendered on twodimensions state equals false", async () => {
        const wrapper = shallow(
            <MapSelector fakeData={true} />
        );

        wrapper.setState({ twoDimensions: false, dataReady: true });
        expect(wrapper.find(TwoDimensionalMap)).toHaveLength(0);
        wrapper.unmount();
    });
});
