import React from 'react';
import { Link } from 'react-router-dom'

class About extends React.Component {
  render() {
    console.log('render About');

    return (
      <div className="Home">
        <h1>About View</h1>
        <Link to={'/'}>Home</Link>
      </div>
    );
  }
}

export default About;
