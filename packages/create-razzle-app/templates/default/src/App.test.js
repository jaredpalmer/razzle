import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

describe('<App />', () => {
  test('renders without exploding', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });
});
