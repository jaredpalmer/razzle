import './App.css';

import { Block, InlineBlock } from 'jsxstyle';

import About from './About';
import Home from './Home';
import Link from 'react-router-dom/Link';
import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';

const App = () => (
  <Block>
    {' '}
    <Block component="ul" margin="2rem auto">
      <InlineBlock component={Link} props={{ to: '/about' }}>
        About
      </InlineBlock>
      <InlineBlock component={Link} props={{ to: '/' }}>
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
