import React from "react";
import MapSelector from "./MapSelector";
import { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import TwoDimensionalMap from "../2dmap/TwoDimensionalMap";
import ThreeDimensionalMap from "../3dmap/ThreeDimensionalMap";

// automatically unmount and cleanup DOM after the test is finished.
configure({ adapter: new Adapter() });

it("Initial state of twodimensions is set to true", () => {
    const wrapper = mount(
        <MapSelector />
    );
    expect(wrapper.state("twoDimensions")).toEqual(true);
    wrapper.unmount();
});

it("2D map is rendered on twodimensions state equals true", () => {
    const wrapper = mount(
        <MapSelector />
    );
    expect(wrapper.contains(<TwoDimensionalMap />)).toEqual(true);
    wrapper.unmount();
});

it("3D map is rendered on twodimensions state equals false", () => {
    const wrapper = mount(
        <MapSelector />
    );
    wrapper.setState({ twoDimensions: false });
    expect(wrapper.contains(<ThreeDimensionalMap />)).toEqual(true);
    wrapper.unmount();
});

it("2D map is NOT rendered on twodimensions state equals false", () => {
    const wrapper = mount(
        <MapSelector />
    );
    wrapper.setState({ twoDimensions: false });
    expect(wrapper.contains(<TwoDimensionalMap />)).toEqual(false);
    wrapper.unmount();
});
