import React from 'react';
import { shallow, mount, render } from 'enzyme';
import MyMap from "./views/Map";



describe("test", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<MyMap/>);
  });

  it('renders bla bla', () => {
    console.log(wrapper.debug());
    expect(wrapper.exists("n")).toBe(true);
  });

});
