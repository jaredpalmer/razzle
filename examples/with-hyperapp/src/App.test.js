/** @jsx h */
import { h } from 'hyperapp';
import { renderToString } from '@hyperapp/render';
import App from './App';

describe('<App />', () => {
  test('renders without exploding', () => {
    const body = document.createElement('body');
    const markup = renderToString(<App state={{}} actions={{}} />);

    expect(markup).toContain('App');
  });
});
