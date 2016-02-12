import React, { PropTypes } from 'react';
import Nav from '../components/Nav';
import { StyleSheet, css } from 'aphrodite';

const App = ({ children }) => {
  return (
    <div>
        <h2 className={css(styles.red)}>
          React Nation
        </h2>
        <Nav/>
      {children}
    </div>
  );
};

const styles = StyleSheet.create({
  red: {
    color: "green",
  },
});

export default App;
