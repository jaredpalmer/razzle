import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { StyleSheet, css } from 'aphrodite';
import { Type } from '../../../style';

const PostListItem = ({ post }) =>
  <div className={css(styles.root)}>
    <Link to={`/post/${post.slug}`} className={css(styles.title)}>{post.title}</Link>
  </div>;

const styles = StyleSheet.create({
  root: {
    margin: '1rem auto',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    fontFamily: Type.sans,
    textDecoration: 'none',
    lineHeight: '1.2',
    letterSpacing: '-0.03em',
    margin: '1rem 0',
    color: '#000',
    transition: '.3s opacity ease',
    ':hover': {
      opacity: .5,
    },
  },
});

export default PostListItem;
