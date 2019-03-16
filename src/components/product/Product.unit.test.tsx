import React from "react";
import { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import Product from "./Product";
import FakeSearchService from "../../services/fakes/FakeSearchService";
import ISearchService from "../../services/fakes/FakeSearchService";
import styles from "./Product.module.scss";
import { Image } from "office-ui-fabric-react";

// automatically unmount and cleanup DOM after the test is finished.
configure({ adapter: new Adapter() });

describe("Product", () => {
    let service: ISearchService = new FakeSearchService();

    it("Product - Image is rendered together with the price", async () => {
        let products = await service.getProduct("");
        let product = products[0];

        const wrapper = mount(<Product product={product} />);

        let result: JSX.Element = (
            <div className={styles.right}>
                <Image src={product.image} height={75} width={75} />
                <h4>{product.price + "DKK"}</h4>
            </div>
        );

        expect(wrapper.contains(result)).toEqual(true);
        wrapper.unmount();
    });

    it("Product - Product name is rendered together with description", async () => {
        let products = await service.getProduct("");
        let product = products[0];

        const wrapper = shallow(<Product product={product} />);

        let result: JSX.Element = (
            <div className={styles.left}>
                <h3>{product.name}</h3>
                <span>{product.description}</span>
            </div>);

        expect(wrapper.contains(result)).toEqual(true);
        wrapper.unmount();
    });

});
