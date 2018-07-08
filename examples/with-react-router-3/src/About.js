import React from 'react';
import { Link } from 'react-router';
import App from './App';
import './Home.css';

class About extends React.Component {
  render() {
    return (
      <App>
        <div className="Home">
          <div className="Home-header">
            <h2>About page</h2>
          </div>
          <p>
            <Link to="home">Home</Link>
          </p>
        </div>
      </App>
    );
  }
}

export default About;
