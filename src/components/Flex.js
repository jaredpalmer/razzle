import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const Center = ({ className, children, ...rest }) => {
  return (
    <div className={css(styles.center, className)} {...rest}>
      {children}
    </div>
  );
};

const styles = StyleSheet.create({
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Center;
