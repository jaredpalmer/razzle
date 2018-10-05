import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './Home';
import About from './About';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <section>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </section>
    );
  }
}

export default App;
