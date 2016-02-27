import React, { PropTypes } from 'react';
import IndexLink from 'react-router/lib/IndexLink';
import Link from 'react-router/lib/Link';
import { StyleSheet, css } from 'aphrodite';
import { Type } from '../style';

const Nav = () =>
  <div>
    <IndexLink to="/" className={css(styles.link)}>Home</IndexLink>
    <Link to="/about" className={css(styles.link)}>About</Link>
    <a href="https://github.com/jaredpalmer/react-production-starter" className={css(styles.link)} target="_blank">GitHub</a>
    <a href="https://twitter.com/jaredpalmer" className={css(styles.link)} target="_blank">Twitter</a>
  </div>;

const styles = StyleSheet.create({
  link: {
    maxWidth: 700,
    color: '#000',
    marginTop: '1rem',
    marginBottom: '1rem',
    marginRight: '1rem',
    fontFamily: Type.sans,
    display: 'inline-block',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: '.2s opacity ease',
    ':hover': {
      opacity: .6,
    },
  },
});

export default Nav;
