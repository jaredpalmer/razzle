import { provideHooks } from 'redial';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {loadPost} from '../actions/PostActions';
import { StyleSheet, css } from 'aphrodite';

const hooks = {
  fetch: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug)),
};

const PostPage = ({ title, content }) => {
  return (
    <div>
      <h1 className={css(styles.primary)}>{ title }</h1>
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

const styles = StyleSheet.create({
  primary: {
    fontSize: '24px',
    fontFamily: '"Proxima Nova"',
    fontWeight: 'bold',
    lineHeight: '1.5',
    margin: '1rem 0',
  },
});

export default provideHooks(hooks)(connect(mapStateToProps)(PostPage));
