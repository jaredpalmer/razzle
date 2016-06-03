import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import Nav from './Nav';
import { StyleSheet, css } from 'aphrodite';
import { Type } from '../style';
import logo from './react-logo.png'

const App = ({ children }) => {
  return (
    <div className={css(styles.root)}>
        <Helmet
          title="React Production Starter"
          titleTemplate="%s - React Production Starter"
        />
      <div className={css(styles.header)}>
        <h1 className={css(styles.title)}>
          React
          Production
          Starter
        </h1>
        <img src={logo} className={css(styles.logo)} alt=""/>
      </div>
        <Nav/>
      {children}
      <footer className={css(styles.footer)}>
        Copyright © 2016 <a className={css(styles.footerLink)}
          href="http://twitter.com/jaredpalmer"
          target="_blank">
          Jared Palmer
        </a>
        </footer>
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    maxWidth: 700,
    color: '#000',
    margin: '2rem auto',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  logo: {
    flex: 1,
    width: 150,
  },
  title: {
    flex: 5,
    color: '#000',
    fontSize: 56,
  },
  footer: {
    margin: '4rem auto',
    textAlign: 'center',
    color: '#b7b7b7',
  },
  footerLink: {
    display: 'inline-block',
    color: '#000',
    textDecoration: 'none',
  },
});

export default App;
