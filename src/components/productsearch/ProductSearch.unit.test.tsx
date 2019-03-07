import React from "react";
import { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import FakeSearchService from "../../services/FakeSearchService";
import ISearchService from "../../services/FakeSearchService";
import { Image, SearchBox } from "office-ui-fabric-react";
import ProductSearch from "./ProductSearch";
import Product from "../product/Product";

// automatically unmount and cleanup DOM after the test is finished.
configure({ adapter: new Adapter() });

describe("productSearch", () => {
    let service: ISearchService = new FakeSearchService();

    it("productSearch - Product 1 and 2 are rendered from the fakeservice", async () => {
        let products = await service.getProduct("");

        let result: JSX.Element[] = [];
        result.push(<Product product={products[0]} />);
        result.push(<Product product={products[1]} />);

        const wrapper = shallow(<ProductSearch fakeData={true} />);
        wrapper.setState({ products: products });

        expect(wrapper.contains(result)).toEqual(true);
        wrapper.unmount();
    });
});
