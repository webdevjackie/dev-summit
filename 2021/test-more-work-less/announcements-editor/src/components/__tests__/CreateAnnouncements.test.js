import React from 'react';
import { shallow } from 'enzyme';
import { mountWithTheme } from '../context-utils';
import CreateAnnouncement from '../CreateAnnouncement';
import Button from 'calcite-react/Button';
import SaveIcon from 'calcite-ui-icons-react/SaveIcon';


it('renders without crashing', () => {
    shallow(<CreateAnnouncement/>);
});

it('save btn disabled when announcement is incomplete for a new announcement', () => {
    const wrapper = shallow(<CreateAnnouncement/>);

    const mockProps = {
        title: 'halfway complete',
        description: ''
    };
     
    wrapper.setState(mockProps);

    expect(wrapper.contains(
        <Button
            className='save-btn' 
            disabled={true}
            type="submit"
            icon={<SaveIcon size={16} />}
            iconPosition="before"
        >
            Save
          </Button>
     )).toEqual(true);
});

it('save btn enabled when announcement is complete', () => {
    const wrapper = shallow(<CreateAnnouncement/>);

    const mockProps = {
        title: 'complete',
        description: 'complete'
    };
     
    wrapper.setState(mockProps);

    expect(wrapper.contains(
        <Button
            className='save-btn' 
            disabled={false}
            type="submit"
            icon={<SaveIcon size={16} />}
            iconPosition="before"
        >
            Save
          </Button>
     )).toEqual(true);
});


it('clicking cancel button will cancel announcement', () => {
    const mockFn = jest.fn();
    CreateAnnouncement.prototype.cancelAnnouncement = mockFn;

    const wrapper = shallow(<CreateAnnouncement/>);
    wrapper.find('#cancel-btn').props().onClick();

    expect(mockFn).toHaveBeenCalledTimes(1);
});