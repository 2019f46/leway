import React from "react";
import { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import FakeSearchService from "../../services/fakes/FakeSearchService";
import ISearchService from "../../services/fakes/FakeSearchService";
import { SearchBox } from "office-ui-fabric-react";
import ProductSearch from "./ProductSearch";
import Product from "../product/Product";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

// automatically unmount and cleanup DOM after the test is finished.
configure({ adapter: new Adapter() });

describe("productSearch", () => {
    let service: ISearchService = new FakeSearchService();

    it("productSearch - Product 1 and 2 are rendered from the fakeservice", async () => {
        let products = await service.getProduct("");
        let mockStore = configureMockStore();
        let store = mockStore({ productData: { products: products, selectedProduct: undefined } });

        const wrapper = mount(<Provider store={store}><ProductSearch fakeData={true} /></Provider>);

        expect(wrapper.find(Product)).toHaveLength(2);
        wrapper.unmount();
    });

    it("productSearch - Renders a searchBox", async () => {
        let products = await service.getProduct("");
        let mockStore = configureMockStore();
        let store = mockStore({ productData: { products: products, selectedProduct: undefined } });

        const wrapper = mount(<Provider store={store}><ProductSearch fakeData={true} /></Provider>);
        expect(wrapper.find(SearchBox)).toHaveLength(1);
        wrapper.unmount();
    });
});
