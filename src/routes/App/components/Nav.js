import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { invalidate } from '../actions';
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

export default connect(state => {
  return {
    state: state,
  };
})(Nav);
