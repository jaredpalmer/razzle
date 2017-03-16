import React from 'react';
import Hello from '../Hello';
import renderer from 'react-test-renderer';

it('renders Hello correctly', () => {
  const tree = renderer.create(<Hello />).toJSON();
  expect(tree).toMatchSnapshot();
});
