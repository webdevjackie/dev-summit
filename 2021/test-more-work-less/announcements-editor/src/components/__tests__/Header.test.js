import React from 'react';
import { shallow } from 'enzyme';
import Header from '../Header';

it('renders without crashing', () => {
    shallow(<Header/>);
});

it('renders header based on status property', () => {
    let wrapper = shallow(<Header status={'active-list'}/>)
    let header = "Active Announcements";

    expect(wrapper.contains(header)).toEqual(true);

    wrapper = shallow(<Header status={'editing'}/>)
    header = 'Add or Edit Announcement';
    expect(wrapper.contains(header)).toEqual(true);

    wrapper = shallow(<Header status={'json-syntax-error'}/>)
    header = 'Error Reading Portal Organization Description';
    expect(wrapper.contains(header)).toEqual(true);
  });