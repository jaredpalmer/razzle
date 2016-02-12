import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const Flex = ({ className, children, ...rest }) =>
  <div className={css(styles.flex, className)} {...rest}>
    {children}
  </div>;

const styles = StyleSheet.create({
  flex: {
    display: 'flex',
  },
});

export default Flex;
