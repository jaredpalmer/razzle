import { app } from 'hyperapp';
import { withRender } from '@hyperapp/render';
import { state, actions, view } from './main';

describe('main app', () => {
  test('renders without exploding', () => {
    const body = document.createElement('body');
    const markup = withRender(app)(state, actions, view, body).toString();

    expect(markup).toContain('Hello Hyperapp');
  });
});
