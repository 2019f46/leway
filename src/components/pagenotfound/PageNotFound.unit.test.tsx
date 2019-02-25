import React from "react";
import { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import PageNotFound from "./PageNotFound";
import { Image, Link } from "office-ui-fabric-react/";

// automatically unmount and cleanup DOM after the test is finished.
configure({ adapter: new Adapter() });

describe("PageNotFound", () => {
    it("PageNotFound - Page renders image", async () => {
        const image = require("../../assets/404.png");
        const wrapper = mount(
            <PageNotFound />
        );

        expect(wrapper.contains(<Image src={image} />)).toEqual(true);
        wrapper.unmount();
    });
    it("PageNotFound - Page renders return link", async () => {
        const image = require("../../assets/404.png");
        const wrapper = mount(
            <PageNotFound />
        );

        expect(wrapper.contains(<Link href={window.location.origin}>Return to Homepage</Link>)).toEqual(true);
        wrapper.unmount();
    });
    it("PageNotFound - Page renders 404 header text", async () => {
        const wrapper = mount(
            <PageNotFound />
        );

        expect(wrapper.contains(<h1>404 - Oh-oh... Can't find the requested page</h1>)).toEqual(true);
        wrapper.unmount();
    });
    it("PageNotFound - verify 404 header text", async () => {
        const wrapper = mount(
            <PageNotFound />
        );

        expect(wrapper.contains(<h1>404 - Oh-oh... Can't find the requested page cause it aint there</h1>)).toEqual(false);
        wrapper.unmount();
    });
});