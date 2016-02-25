import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { StyleSheet, css } from 'aphrodite';

const PostListItem = ({ post }) =>
  <div className={css(styles.root)}>
    <Link to={`/post/${post.slug}`} className={css(styles.title)}>{post.title}</Link>
  </div>;

const styles = StyleSheet.create({
  root: {
    margin: '1rem auto',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '1.5',
    margin: '1rem 0',
    color: '#000',
  },
});

export default PostListItem;
