import { provideHooks } from 'redial';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {loadPost} from '../actions';
import PrimaryText from '../../../components/PrimaryText';
import { StyleSheet, css } from 'aphrodite';
import { layout } from '../../../constants';

const hooks = {
  defer: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug)),
};

const PostPage = ({ title, content }) => {
  return (
    <div>
      <PrimaryText className={css(styles.primary)}>{ title }</PrimaryText>
      <p className={css(styles.primary)}>{ content }</p>
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
    fontSize: '1rem',
    lineHeight: '1.5',
    margin: '1rem 0',
    fontFamily: layout.serif,
  },
});

export default provideHooks(hooks)(connect(mapStateToProps)(PostPage));
