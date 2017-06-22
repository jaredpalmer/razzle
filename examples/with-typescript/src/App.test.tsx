import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

describe('<App />', () => {
  test('renders without exploding', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });
});
