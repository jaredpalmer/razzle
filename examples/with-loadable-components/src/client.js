import React from "react";
import { hydrate } from "react-dom";
import { loadableReady } from "@loadable/component";
import App from "./App";

// Load all components needed before rendering
loadableReady().then(() => {
  hydrate(<App />, document.getElementById("root"));
});

if (module.hot) {
  module.hot.accept();
}
