import { Link } from 'found';
import React from 'react';

import FetchBoardsButton from './components/FetchBoardsButton';
import logo from './react.svg';

import './Home.css';

class Home extends React.Component {
  public render() {
    return (
      <div className="Home">
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to Razzle.js</h2>
        </div>
        <p className="Home-intro">
          To get started, edit <code>src/Home.js</code> or <code>src/About.js</code>and save to reload.
        </p>
        <Link to="/about">About -></Link>
        <FetchBoardsButton />
      </div>
    );
  }
}

export default Home;
