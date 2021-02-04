import React from 'react';
import { shallow } from 'enzyme';
import App from '../../App';

let app = shallow(<App />);
let mockProps = {
  'portalLoadStatus': ''
};

it('renders without crashing', () => {
  shallow(<App/>);
});

it('renders Loading indicator when loading', () => {
  mockProps = {
    portalLoadStatus: 'loading'
  };
 
  app.setState(mockProps);

  expect(app.find('Loader').length).toBeGreaterThanOrEqual(1);
});

it('renders ActiveAnnouncements component once portal loaded', () => {
  mockProps = {
    portalLoadStatus: 'success',
    currentView: 'active-list'
  };

  app.setState(mockProps);
  expect(app.find('ActiveAnnouncements').length).toBeGreaterThanOrEqual(1);
});

it('renders failure message if portal failed to load', () => {
  mockProps = {
    portalLoadStatus: 'failed'
  };

  app.setState(mockProps);
  expect(app.find('CalciteH2').length).toBeGreaterThanOrEqual(1);
});