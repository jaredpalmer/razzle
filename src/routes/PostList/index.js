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

PostListPage.PropTypes = {
  posts: PropTypes.array.isRequired,
};

const PostListPage = ({ posts }) =>
  <div>
    <h2 className={css(styles.title)}>PostListPage</h2>
    {posts.map((post, i) => <PostListItem key={post.id} post={post} />)}
  </div>;



const styles = StyleSheet.create({
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '1.5',
    margin: '1rem 0',
  },
});

export default provideHooks(redial)(connect(mapStateToProps)(PostListPage));
