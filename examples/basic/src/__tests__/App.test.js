import App from '../App';
import React from 'react';
import ReactDOM from 'react-dom/server';

describe('<App />', () => {
  test('renders without exploding', () => {
    const app = ReactDOM.renderToString(<App />);
    expect(app).toBeTruthy();
  });
});
