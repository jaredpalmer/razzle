import React, { Component } from 'react';
import Loadable from 'react-loadable';
import './Home.css';

const Intro = Loadable({
  loader: () => import('./Intro'),
  loading: () => null,
});

const Welcome = Loadable({
  loader: () => import('./Welcome'),
  loading: () => null,
});
const Logo = Loadable({
  loader: () => import('./Logo'),
  loading: () => null,
});

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="Home-header">
          <Logo />
          <Welcome />
        </div>
        <Intro />
        <ul className="Home-resources">
          <li>
            <a href="https://github.com/jaredpalmer/razzle">Docs</a>
          </li>
          <li>
            <a href="https://github.com/jaredpalmer/razzle/issues">Issues</a>
          </li>
          <li>
            <a href="https://palmer.chat">Community Slack</a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Home;
