import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Home';


const App = () => (
  <Switch>
    <Route exact={true} path="/" component={Home} />
  </Switch>
);

export default App;
