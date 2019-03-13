import React from 'react';
import { Link } from 'react-router-dom'

class Home extends React.Component {
  render() {
    console.log('render Home');

    return (
      <div className="Home">
        <h1>Home View</h1>
        <Link to={'/about/'}>About</Link>
        asd
      </div>
    );
  }
}

export default Home;
