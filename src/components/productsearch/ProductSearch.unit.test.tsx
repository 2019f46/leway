import React from "react";
import { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import FakeSearchService from "../../services/fakes/FakeSearchService";
import ISearchService from "../../services/fakes/FakeSearchService";
import { Image, SearchBox } from "office-ui-fabric-react";
import ProductSearch from "./ProductSearch";
import Product from "../product/Product";
import { IProduct } from "../../models/ProductModel";

// automatically unmount and cleanup DOM after the test is finished.
configure({ adapter: new Adapter() });

describe("productSearch", () => {
    let service: ISearchService = new FakeSearchService();

    it("productSearch - Product 1 and 2 are rendered from the fakeservice", async () => {
        let products = await service.getProduct("");

        const wrapper = shallow(<ProductSearch fakeData={true} />);
        wrapper.setState({ products: products });

        expect(wrapper.find(Product)).toHaveLength(2);
        wrapper.unmount();
    });

    it("productSearch - Renders a searchBox", async () => {
        const wrapper = shallow(<ProductSearch fakeData={true} />);
        expect(wrapper.find(SearchBox)).toHaveLength(1);
        wrapper.unmount();
    });
});
