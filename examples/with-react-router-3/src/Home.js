import React from 'react';
import { Link } from 'react-router';
import logo from './react.svg';
import App from './App';
import './Home.css';

class Home extends React.Component {
  render() {
    return (
      <App>
        <div className="Home">
          <div className="Home-header">
            <img src={logo} className="Home-logo" alt="logo" />
            <h2>Welcome to Razzle</h2>
          </div>
          <p className="Home-intro">
            To get started, edit <code>src/App.js</code> or{' '}
            <code>src/Home.js</code> and save to reload.
          </p>
          <p>
            <Link to="about">About</Link>
          </p>
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
      </App>
    );
  }
}

export default Home;
