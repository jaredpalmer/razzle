import { provideHooks } from 'redial'
import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { loadPost } from '../actions'
import { StyleSheet, css } from 'aphrodite'
import Helmet from 'react-helmet'
import NotFound from '../../../components/NotFound'
import { getPostBySlug, getIsFetching, getErrorMessage } from '../../PostList/reducer'

const redial = {
  fetch: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug))
}

const mapStateToProps = (state, { params }) => ({
  post: getPostBySlug(state, params.slug),
  isFetching: getIsFetching(state),
  error: getErrorMessage(state)
})

const Post = ({ post, isFetching, error }) => {
  if (!error) {
    return (
      <div>
        <Helmet title={post.title} />
        {isFetching &&
          <div>
            <h2 className={css(styles.loading)}>Loading....</h2>
          </div>}
        {!isFetching &&
          <div>
            <h2 className={css(styles.title)}>{post.title}</h2>
            <p className={css(styles.content)}>{post.content}</p>
          </div>}
      </div>
    )
  } else {
    // maybe check for different types of errors and display appropriately
    return <NotFound />
  }
}

Post.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.object
}

const styles = StyleSheet.create({
  content: {
    fontSize: '1rem',
    lineHeight: '1.5',
    margin: '1rem 0',
    color: '#555'
  },
  title: {
    fontSize: 28,
    margin: '0 auto 1.5rem',
    color: '#000'
  },
  loading: {
    fontSize: 28,
    margin: '0 auto 1.5rem',
    color: '#b7b7b7'
  }
})

export default provideHooks(redial)(withRouter(connect(mapStateToProps)(Post)))
