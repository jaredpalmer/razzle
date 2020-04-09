import './App.css';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';
import Header from './Header';
import Footer from './Footer';

const Home = loadable(() => import('./Home'));
const About = loadable(() => import('./About'));

const App = () => (
  <>
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
    </Switch>
    <Footer />
  </>
);

export default App;
