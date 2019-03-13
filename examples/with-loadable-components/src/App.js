import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import loadable from '@loadable/component'

const Home = loadable(() => import('./Home'))
const About = loadable(() => import('./About'))

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
  </Switch>
);

export default App;
