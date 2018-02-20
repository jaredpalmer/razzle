import { h, render } from 'preact';
import App from './App';
/** @jsx h */

let root;
function renderApp() {
  root = render(<App />, document.body, document.body.firstElementChild);
}

// Initial render.
renderApp();

if (module.hot) {
  module.hot.accept('./App', renderApp);
}
