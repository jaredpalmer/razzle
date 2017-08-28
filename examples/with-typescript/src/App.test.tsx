import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

describe('<App />', () => {
  test('renders without exploding', () => {
    const div = document.createElement('div');
    div.style.color = 'white';
    ReactDOM.render(<App />, div);
  });
});
