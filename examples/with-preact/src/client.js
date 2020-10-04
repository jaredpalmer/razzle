import { h, hydrate } from "preact";
import App from "./App";
/** @jsx h */

hydrate(<App />, document.body, document.body.firstElementChild);
