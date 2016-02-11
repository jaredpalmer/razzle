import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { invalidate } from '../actions/PostActions';
import { connect } from 'react-redux';

const Nav = ({ dispatch }) => {
  return (
      <div>
        <Link to="/" onClick={(e) => {
          e.stopPropagation();
          dispatch(invalidate());
        }}>Home</Link>
            <Link to="/edit">Edit</Link>
      </div>
    );
};

// Nav.contextTypes ={
//   history:
// }

export default connect()(Nav);
