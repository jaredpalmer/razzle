import React from 'react';
import ReactDOM from 'react-dom';
import MemoryRouter from 'react-router-dom/MemoryRouter';
import Home from './Home';

describe('<Home />', () => {
  test('renders without exploding', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      div
    );
  });
});