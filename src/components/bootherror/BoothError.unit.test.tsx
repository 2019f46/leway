import React from "react";
import { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import BoothError from "./BoothError";
import sinon from "sinon";
import { PrimaryButton, DefaultButton, Dialog, DialogFooter } from "office-ui-fabric-react";

// automatically unmount and cleanup DOM after the test is finished.
configure({ adapter: new Adapter() });

describe("BoothError", () => {
    it("BoothError - Clicking OK returns true on callback", () => {
        let callback = sinon.spy();
        const wrapper = mount(
            <BoothError acknowledge={callback} />
        );

        wrapper.find("PrimaryButton").simulate("click");

        expect(callback.calledOnce).toBe(true);
    });

    it("BoothError - Renders PrimaryButton", async () => {
        let callback = sinon.spy();
        const wrapper = shallow(<BoothError acknowledge={callback} />);

        expect(wrapper.find(PrimaryButton)).toHaveLength(1);
        wrapper.unmount();
    });

    it("BoothError - Renders a DefaultButton", async () => {
        let callback = sinon.spy();
        const wrapper = shallow(<BoothError acknowledge={callback} />);

        expect(wrapper.find(DefaultButton)).toHaveLength(1);
        wrapper.unmount();
    });

    it("BoothError - Is a Dialog", async () => {
        let callback = sinon.spy();
        const wrapper = shallow(<BoothError acknowledge={callback} />);

        expect(wrapper.find(Dialog)).toHaveLength(1);
        wrapper.unmount();
    });
});
