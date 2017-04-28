import { h, render } from 'preact';
import App from './App';

let root;
function renderApp() {
  root = render(<App />, document.body, document.body.firstElementChild);
}

// Initial render.
renderApp();

if (module.hot) {
  module.hot.accept('./App', renderApp);
}
