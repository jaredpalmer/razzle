import { provideHooks } from 'redial';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {loadPost} from '../actions';
import PrimaryText from '../../../components/PrimaryText';
import { StyleSheet, css } from 'aphrodite';
import { layout } from '../../../constants';

const PostPage = ({ title, content }) => {
  return (
    <div>
      <PrimaryText className={css(styles.primary)}>{ title }</PrimaryText>
      <p className={css(styles.primary)}>{ content }</p>
    </div>
  );
};

PostPage.need = [(params) => {
  return loadPost.bind(null, params.slug)();
},
];

PostPage.contextTypes = {
  router: React.PropTypes.object,
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

export default connect(mapStateToProps)(PostPage);
