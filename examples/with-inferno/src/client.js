import { hydrate } from "inferno-hydrate";
import App from "./App";

if (module.hot) {
  require("inferno-devtools");
}

hydrate(<App />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
