import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const PrimaryText = ({ className, children, ...rest }) => {
  return (
    <div className={css(styles.primary)} {...rest}>
      {children}
    </div>
  );
};

const styles = StyleSheet.create({
  primary: {
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '1.5',
    margin: '1rem 0',
    fontFamily: '"Helvetica Neue"',
  },
});

export default PrimaryText;
