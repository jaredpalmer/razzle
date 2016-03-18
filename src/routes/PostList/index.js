import { provideHooks } from 'redial';
import React, { PropTypes } from 'react';
import { loadPosts } from './actions';
import { connect } from 'react-redux';
import PostListItem from './components/PostListItem';
import { StyleSheet, css } from 'aphrodite';

const redial = {
  fetch: ({ dispatch }) => dispatch(loadPosts()),
};

const mapStateToProps = (state) => ({
  posts: state.posts.data,
});

const PostListPage = ({ posts }) =>
  <div className={css(styles.root)}>
    {posts.map((post, i) => <PostListItem key={post.id} post={post} />)}
  </div>;

PostListPage.PropTypes = {
  posts: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  root: {
    maxWidth: 500,
  },
});

export default provideHooks(redial)(connect(mapStateToProps)(PostListPage));
