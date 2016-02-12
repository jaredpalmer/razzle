import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { invalidate } from '../actions/PostActions';
import { connect } from 'react-redux';
import Center from './Center';
const Nav = ({ dispatch }) => {
  return (
      <Center>
        <Link to="/" onClick={(e) => {
          e.stopPropagation();
          dispatch(invalidate());
        }}>Home</Link>
            <Link to="/edit">Edit</Link>
      </Center>
    );
};

// Nav.contextTypes ={
//   history:
// }

export default connect()(Nav);
