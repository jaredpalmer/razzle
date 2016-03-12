import { provideHooks } from 'redial';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadPost } from '../actions';
import { StyleSheet, css } from 'aphrodite';
import { Type } from '../../../style';
import Helmet from 'react-helmet';
import NotFound from '../../../components/NotFound';

const redial = {
  fetch: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug)),
};

const mapStateToProps = state => ({
  title: state.currentPost.data.title,
  content: state.currentPost.data.content,
  isLoading: state.currentPost.isLoading,
  error: state.currentPost.error
});

const PostPage = ({ title, content, isLoading, error }) => {
  if (!error) {
    return (
      <div>
        <Helmet
          title={ title }
        />
        {isLoading &&
          <div>
            <h2 className={css(styles.title)}>Loading....</h2>
            <p className={css(styles.primary)}></p>
          </div>
        }
        {!isLoading &&
          <div>
            <h2 className={css(styles.title)}>{ title }</h2>
            <p className={css(styles.body)}>{ content }</p>
          </div>
        }
      </div>
    );
  } else {
    // maybe check for different types of errors and display appropriately
    return <NotFound />;
  }
};

PostPage.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.object
};

const styles = StyleSheet.create({
  body: {
    fontSize: '1.25rem',
    lineHeight: '1.5',
    margin: '1rem 0',
  },
  title: {
    fontSize: '36px',
    margin: '1rem 0',
    color: '#000',
  },
});

export default provideHooks(redial)(connect(mapStateToProps)(PostPage));
