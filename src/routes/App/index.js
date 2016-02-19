import React, { PropTypes } from 'react';
import Nav from './components/Nav';
import { StyleSheet, css } from 'aphrodite';

const App = ({ children }) => {
  return (
    <div className={css(styles.root)}>
        <h2 className={css(styles.title)}>
          React Nation
        </h2>
        <Nav/>
      {children}
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    color: '#000',
    margin: '2rem',
  },
  title: {
    color: '#000',
  },
});

export default App;
