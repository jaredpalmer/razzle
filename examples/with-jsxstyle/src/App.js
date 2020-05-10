import "./App.css";

import { Block, InlineBlock } from "jsxstyle";

import About from "./About";
import Home from "./Home";
import { Link, Route, Switch } from "react-router-dom";
import React from "react";

const App = () => (
  <Block>
    <Block component="ul" margin="2rem auto">
      <InlineBlock component={Link} props={{ to: "/about" }}>
        About
      </InlineBlock>
      <InlineBlock component={Link} props={{ to: "/" }}>
        Home
      </InlineBlock>
    </Block>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
    </Switch>
  </Block>
);

export default App;
