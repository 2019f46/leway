import React from "react";
import { ProjectRouter } from "./ProjectRouter";
import { mount } from "enzyme";
import Home from "../components/Home";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import PageNotFound from "../components/pagenotfound/PageNotFound";
import { MemoryRouter } from "react-router";


describe("Routing", () => {
  
  configure({ adapter: new Adapter() });

  it("/home should redirect to home", () => {
    let wrapper = mount(
      <MemoryRouter initialEntries={["/home"]}>
        <ProjectRouter />
      </MemoryRouter>
    );
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it("/ should redirect to home", () => {
    let wrapper = mount(
      <MemoryRouter initialEntries={["/"]}>
        <ProjectRouter />
      </MemoryRouter>
    );
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it("/ggwp should redirect to pagenotfound", () => {
    let wrapper = mount(
      <MemoryRouter initialEntries={["/ggwp"]}>
        <ProjectRouter />
      </MemoryRouter>
    );
    expect(wrapper.find(PageNotFound)).toHaveLength(1);
  });

});
