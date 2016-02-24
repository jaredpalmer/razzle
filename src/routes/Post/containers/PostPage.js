import { provideHooks } from 'redial';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadPost } from '../actions';
import PrimaryText from '../../../components/PrimaryText';
import { StyleSheet, css } from 'aphrodite';
import { layout } from '../../../constants';
import Helmet from 'react-helmet';

const redial = {
  fetch: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug)),
};

const mapStateToProps = state => ({
  title: state.currentPost.data.title,
  content: state.currentPost.data.content,
  isLoading: state.currentPost.isLoading,
});

const PostPage = ({ title, content, isLoading }) => {
  return (
    <div>
      <Helmet
        title={ title }
      />
      {isLoading &&
        <div>
          <PrimaryText className={css(styles.primary)}>Loading....</PrimaryText>
          <p className={css(styles.primary)}></p>
        </div>
      }
      {!isLoading &&
        <div>
          <PrimaryText className={css(styles.primary)}>{ title }</PrimaryText>
          <p className={css(styles.primary)}>{ content }</p>
        </div>
      }
    </div>
  );
};

PostPage.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  isLoading: PropTypes.bool,
};

const styles = StyleSheet.create({
  primary: {
    fontSize: '1rem',
    lineHeight: '1.5',
    margin: '1rem 0',
    fontFamily: layout.serif,
  },
});

export default provideHooks(redial)(connect(mapStateToProps)(PostPage));
