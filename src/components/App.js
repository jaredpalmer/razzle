import React, { PropTypes } from 'react';
import Nav from './Nav';
import { StyleSheet, css } from 'aphrodite';
import Helmet from 'react-helmet';

const App = ({ children }) => {
  return (
    <div className={css(styles.root)}>
        <Helmet
          title="React Production Starter"
          titleTemplate="%s - React Production Starter"
        />
        <h2 className={css(styles.title)}>
          React Production Starter
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
