import React, { PropTypes } from 'react';
import IndexLink from 'react-router/lib/IndexLink';
import Link from 'react-router/lib/Link';

const Nav = () =>
  <div>
    <IndexLink to="/">Home</IndexLink>
    <Link to="/edit">Edit</Link>
  </div>;

export default Nav;
