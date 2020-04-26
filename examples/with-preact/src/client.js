import { h, hydrate } from "preact";
import App from "./App";
/** @jsx h */

let root;
function renderApp() {
  root = hydrate(<App />, document.body, document.body.firstElementChild);
  return root;
}

// Initial render.
renderApp();

if (module.hot) {
  module.hot.accept("./App", renderApp);
}
