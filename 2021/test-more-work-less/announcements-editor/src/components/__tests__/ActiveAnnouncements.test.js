import React from 'react';
import { shallow } from 'enzyme';
import { mountWithTheme } from '../context-utils';
import ActiveAnnouncements from '../ActiveAnnouncements';

const mockAnnouncements = "[ { \"date\": \"01/31/2018 12:00AM\", \"title\": \"Test 1\", \"description\": \"Announcement 1 Test\" }, { \"date\": \"02/01/2018 2:00PM\", \"title\": \"Test Announcement 2\", \"description\": \"More information about the second test announcement here.\" } ]";

it('renders without crashing', () => {
    shallow(<ActiveAnnouncements/>);
});

it('displays all announcements in a calcite-react List', () => {
    const wrapper = mountWithTheme(<ActiveAnnouncements currentAnnouncements={ mockAnnouncements }/>);
    expect(wrapper.find('ListItem').length).toBeGreaterThanOrEqual(2);
});

it('displays no active announcements', () => {
    const wrapper = mountWithTheme(<ActiveAnnouncements currentAnnouncements={''}/>);
    expect(wrapper.find('ListItem').length).toBeLessThan(1);
});

it('clicking delete fires the delete announcement', () => {
    const instance = mountWithTheme(
        <ActiveAnnouncements currentAnnouncements={mockAnnouncements}
        />
      ).find(ActiveAnnouncements).instance();
    const deleteSpy = jest.spyOn(instance, 'deleteAnnouncement');

    instance.deleteAnnouncement();
    
    expect(deleteSpy).toHaveBeenCalled();
});

it('displays edit buttons per list item', () => {
    const wrapper = mountWithTheme(<ActiveAnnouncements currentAnnouncements={ mockAnnouncements }/>);
    expect(wrapper.find('PencilIcon').length).toBeGreaterThanOrEqual(2);
});