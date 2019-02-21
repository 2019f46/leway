import React from "react";
import { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import TwoDimensionalMap from "../2dmap/TwoDimensionalMap";
import FakeMapService from "../../services/FakeMapService";
import { IMapService } from "../../services/MapService";
import styles from "./TwoDimensionalMap.module.scss";

// automatically unmount and cleanup DOM after the test is finished.
configure({ adapter: new Adapter() });

describe("TwoDimensionalMap", () => {

    it("TwoDimensionalMap - Initial mapReady state is false", async () => {
        let fakeService: IMapService = new FakeMapService();
        let data = await fakeService.getMapData();

        const wrapper = shallow(
            <TwoDimensionalMap polygonData={data} unit={true} />
        );

        expect(wrapper.state("mapReady")).toEqual(false);
        wrapper.unmount();
    });

    it("TwoDimensionalMap - Initial mapData is equal to state", async () => {
        let fakeService: IMapService = new FakeMapService();
        let data = await fakeService.getMapData();

        const wrapper = shallow(
            <TwoDimensionalMap polygonData={data} unit={true} />
        );

        expect(wrapper.state("mapData")).toEqual(data);
        wrapper.unmount();
    });

    it("TwoDimensionalMap - Renders svg element", async () => {
        let fakeService: IMapService = new FakeMapService();
        let data = await fakeService.getMapData();

        const wrapper = mount(
            <TwoDimensionalMap polygonData={data} unit={true} />
        );

        expect(wrapper.contains(<div className={styles.twoDimensionalMapContainer}>
            <svg className={styles.svgContainer}>
                <svg id="svg" className={styles.svgMap}>
                </svg>
            </svg>
        </div>)).toEqual(true);
        wrapper.unmount();
    });

});
