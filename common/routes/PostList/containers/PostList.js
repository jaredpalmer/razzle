import { provideHooks } from 'redial'
import React, { PropTypes } from 'react'
import { loadPosts } from '../actions'
import { connect } from 'react-redux'
import PostListItem from '../components/PostListItem'
import { StyleSheet, css } from 'aphrodite'
import Helmet from 'react-helmet'
import { getPosts, getIsFetching, getErrorMessage } from '../reducer'

const redial = {
  fetch: ({ dispatch }) => dispatch(loadPosts())
}

const mapStateToProps = state => ({
  posts: getPosts(state),
  isFetching: getIsFetching(state),
  errorMessage: getErrorMessage(state)
})

const PostListPage = ({ posts, isFetching, errorMessage }) => (
  <div className={css(styles.root)}>
    <Helmet title='Posts' />
    {isFetching &&
      <div>
        <h2 className={css(styles.title)}>Loading....</h2>
      </div>}
    {!isFetching &&
      posts.map((post, i) => <PostListItem key={post.id} post={post} />)}
  {errorMessage}
  </div>
)

PostListPage.PropTypes = {
  posts: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  root: {
    maxWidth: 500
  },
  title: {
    fontSize: 28,
    margin: '0 auto 1.5rem',
    color: '#b7b7b7'

  }
})

export default provideHooks(redial)(connect(mapStateToProps)(PostListPage))
