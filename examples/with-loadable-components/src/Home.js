import './Home.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import Body from './Body';

class Home extends React.Component {
  render() {
    console.log('render Home');

    return (
      <div className="Home">
        <div className="Home-header">
          <Logo />
        </div>
        <Link to={'/about/'}>About</Link>
        <h1>Home View</h1>
        <Body />
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
