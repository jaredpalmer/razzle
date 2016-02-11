import { provideHooks } from 'redial';
import React, { PropTypes } from 'react';
import {loadPosts} from '../actions/PostListActions';
import { connect } from 'react-redux';
import PostListItem from '../components/PostListItem';

const PostListPage = ({ posts }) =>
  <div>
    <h2>PostListPage</h2>
    {posts.map((post, i) => <PostListItem key={post.id} post={post} />)}
  </div>;

const hooks = {
  fetch: ({ dispatch }) => dispatch(loadPosts()),
};

function mapStateToProps(state) {
  return {
    posts: state.posts.data,
  };
}

export default provideHooks(hooks)(connect(mapStateToProps)(PostListPage));
