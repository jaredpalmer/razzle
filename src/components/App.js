import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';
import Helmet from 'react-helmet';
import Nav from './Nav';

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
    maxWidth: 700,
    color: '#000',
    margin: '2rem auto',
  },
  title: {
    color: '#000',
  },
});

export default App;
