import React from "react";
import { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import TwoDimensionalMap from "../2dmap/TwoDimensionalMap";
import FakeMapService from "../../services/fakes/FakeMapService";
import { IMapService } from "../../services/MapService";
import styles from "./TwoDimensionalMap.module.scss";
import Snap from "snapsvg-cjs";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { ISearchService } from "../../services/SearchService";
import FakeSearchService from "../../services/fakes/FakeSearchService";
configure({ adapter: new Adapter() });

jest.mock("../gestureWrap/GestureWrap", (props: any) => (props: any) => <div>{props.children}</div>);

describe("TwoDimensionalMap", () => {
  let fakeService: IMapService = new FakeMapService();
  let service: ISearchService = new FakeSearchService();

  it("TwoDimensionalMap - Initial data prop is equal to received sent data", async () => {
    let data = await fakeService.getMapData();
    let products = await service.getProduct("");
    let mockStore = configureMockStore();
    let store = mockStore({ productData: { products: products, selectedProduct: undefined } });

    const wrapper = mount(<Provider store={store}><TwoDimensionalMap polygonData={data} /></Provider>);

    expect(wrapper.find(TwoDimensionalMap).prop("polygonData")).toEqual(data);
    wrapper.unmount();
  });

  it("TwoDimensionalMap - Renders svg element", async () => {
    let data = await fakeService.getMapData();
    let products = await service.getProduct("");
    let mockStore = configureMockStore();
    let store = mockStore({ productData: { products: products, selectedProduct: undefined } });

    const wrapper = mount(<Provider store={store}><TwoDimensionalMap polygonData={data} /></Provider>);

    expect(
      wrapper.contains(
        <svg
          id="svg"
          className={styles.svgMap}
          viewBox={"0 0 800 650"}
        />
      )
    ).toEqual(true);
    wrapper.unmount();
  });

  it("TwoDimensionalMap - Snap correctly renders polygons", async () => {
    let snap = Snap("#svg", 1);

    let dataset = [{ x: 10, y: 30 }, { x: 20, y: 40 }, { x: 30, y: 50 }];

    let polygon = "";

    dataset.forEach(coord => {
      // generate string with coordinates
      polygon += `${coord.x}, ${coord.y} `;
    });

    // create the polygon
    let expected = snap.polygon(polygon as any).toString();

    let result = `<polygon points=\"10, 30 20, 40 30, 50 \"/>`;
    expect(expected).toEqual(result);
  });
});
