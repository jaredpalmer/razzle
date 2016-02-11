import { provideHooks } from 'redial';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {loadPost} from '../actions/PostActions';

const hooks = {
  fetch: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug)),
};

const PostPage = ({ title, content }) => {
  return (
    <div>
      <h1>{ title }</h1>
      <p>{ content }</p>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    title: state.currentPost.data.title,
    content: state.currentPost.data.content,
  };
}

export default provideHooks(hooks)(connect(mapStateToProps)(PostPage));
