import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Home from './Home';
import About from './About';

const Routes = props => {
  return (
    <Router history={browserHistory} {...props}>
      <Route path="/" component={Home} />
      <Route path="home" component={Home} />
      <Route path="about" component={About} />
    </Router>
  );
};

export default Routes;
