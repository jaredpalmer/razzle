/** @jsx h */
import { app } from 'hyperapp';

import { state, actions, view } from './main';

app(state, actions, view, document.body);

if (module.hot) {
  module.hot.accept();
}
