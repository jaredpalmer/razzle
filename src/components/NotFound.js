import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { StyleSheet, css } from 'aphrodite';
import { Type } from '../style';

const NotFound = () =>
  <div>
    <Helmet title="Not Found" />

    <h1>Page Not Found!</h1>
  </div>;

export default NotFound;
