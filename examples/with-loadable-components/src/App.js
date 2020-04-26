import "./App.css";
import React from "react";
import loadable from "@loadable/component";

const Header = loadable(() => import("./Header"));
const Body = loadable(() => import("./Body"));
const Footer = loadable(() => import("./Footer"));

const App = () => (
  <div>
    <h3>Welcome to the Razzle</h3>
    <Header />
    <Body />
    <Footer />
  </div>
);

export default App;
