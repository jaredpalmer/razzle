import React from 'react';

import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/page1">page1</Link>
      </li>
      <li>
        <Link to="/page2">page2</Link>
      </li>
    </ul>
  );
}

export default Navigation;
