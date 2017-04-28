import React from 'react';
import renderer from 'react-test-renderer';
import MemoryRouter from 'react-router-dom/MemoryRouter';
import App from '../App';

it('renders App correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('hello', async () => {
  const yo = await Promise.resolve('hello');
  expect(yo).toEqual('hello');
});
