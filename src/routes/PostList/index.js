import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import { provideHooks } from 'redial'
import PostListItem from './components/PostListItem'
import { loadPosts } from './actions'

const redial = {
  fetch: ({ dispatch }) => dispatch(loadPosts())
}

const mapStateToProps = (state) => ({
  posts: state.posts.data
})

const PostListPage = ({ posts }) =>
  <div className={css(styles.root)}>
    {posts.map((post, i) => <PostListItem key={post.id} post={post} />)}
  </div>

PostListPage.propTypes = {
  posts: React.PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  root: {
    maxWidth: 500
  }
})

export default provideHooks(redial)(connect(mapStateToProps)(PostListPage))
