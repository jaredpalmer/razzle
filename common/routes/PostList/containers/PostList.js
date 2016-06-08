import { provideHooks } from 'redial'
import React, { PropTypes } from 'react'
import { loadPosts } from '../actions'
import { connect } from 'react-redux'
import PostListItem from '../components/PostListItem'
import { StyleSheet, css } from 'aphrodite'
import Helmet from 'react-helmet'
import { selectPosts } from '../reducer'

const redial = {
  fetch: ({ dispatch }) => dispatch(loadPosts())
}

const mapStateToProps = (state) => ({
  posts: selectPosts(state)
})

const PostListPage = ({ posts }) => (
  <div className={css(styles.root)}>
    <Helmet title='Posts' />
    {posts.map((post, i) => <PostListItem key={post.id} post={post} />)}
  </div>
)

PostListPage.PropTypes = {
  posts: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  root: {
    maxWidth: 500
  }
})

export default provideHooks(redial)(connect(mapStateToProps)(PostListPage))
