import React from 'react';
import Enzyme, {shallow, mount, render} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import enzymeSerializer from 'enzyme-to-json/serializer';

Enzyme.configure({
    adapter: new EnzymeAdapter()
});

global.React = React;
global.shallow = shallow;
global.mount = mount;
global.render = render;
global.enzymeSerializer = enzymeSerializer;