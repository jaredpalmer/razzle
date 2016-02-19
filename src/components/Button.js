import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const Button = ({ className, children, ...rest }) => {
  return (
    <div className={css(styles.primary)} {...rest}>
      {children}
    </div>
  );
};

const styles = StyleSheet.create({
  button: {
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '1.5',
    margin: '1rem 0',
  },
});

export default PrimaryText;
