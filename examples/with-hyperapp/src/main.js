/** @jsx h */
import { h } from 'hyperapp';
import App from './App';

/* MODEL */
const state = { count: 0 };

/* UPDATE */
const actions = {
  down: value => state => ({ count: state.count - value }),
  up: value => state => ({ count: state.count + value }),
};

/* VIEW */
const view = (state, actions) => <App state={state} actions={actions} />;

export { state, actions, view };
