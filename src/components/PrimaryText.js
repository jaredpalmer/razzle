import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';
import {layout} from '../constants';

const PrimaryText = ({ className, children, ...rest }) => {
  return (
    <div className={css(styles.primary)} {...rest}>
      {children}
    </div>
  );
};

const styles = StyleSheet.create({
  primary: {
    fontSize: '1.5rem',
    lineHeight: '1.5',
    margin: '1rem 0',
    fontWeight: 'bold',
    fontFamily: layout.sans,
  },
});

export default PrimaryText;
