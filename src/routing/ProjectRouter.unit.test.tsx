import React from "react";
import { ProjectRouter } from "./ProjectRouter";
import { mount } from "enzyme";
import Home from "../components/Home";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import PageNotFound from "../components/pagenotfound/PageNotFound";
import { MemoryRouter } from "react-router";
import SettingsPage from "../components/settingspage/SettingsPage";

describe("Routing", () => {
  configure({ adapter: new Adapter() });

  it("Routing - /home should redirect to home", () => {
    let wrapper = mount(
      <MemoryRouter initialEntries={["/home"]}>
        <ProjectRouter />
      </MemoryRouter>
    );
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it("Routing - / should redirect to home", () => {
    let wrapper = mount(
      <MemoryRouter initialEntries={["/"]}>
        <ProjectRouter />
      </MemoryRouter>
    );
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it("Routing - /ggwp should redirect to pagenotfound", () => {
    let wrapper = mount(
      <MemoryRouter initialEntries={["/ggwp"]}>
        <ProjectRouter />
      </MemoryRouter>
    );
    expect(wrapper.find(PageNotFound)).toHaveLength(1);
  });

  it("Routing - /settings should redirect to SettingsPage", () => {
    let wrapper = mount(
      <MemoryRouter initialEntries={["/settings"]}>
        <ProjectRouter />
      </MemoryRouter>
    );
    expect(wrapper.find(SettingsPage)).toHaveLength(1);
  });

});
