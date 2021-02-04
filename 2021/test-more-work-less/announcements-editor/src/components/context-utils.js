import React from 'react';
import { mount } from 'enzyme';
import CalciteThemeProvider from 'calcite-react/CalciteThemeProvider';

const mountWithTheme = node => mount(<CalciteThemeProvider>{node}</CalciteThemeProvider>);

export { mountWithTheme };