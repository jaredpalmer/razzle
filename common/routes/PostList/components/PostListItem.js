import React from 'react'
import { Link } from 'react-router'
import { StyleSheet, css } from 'aphrodite'

const PostListItem = ({ post }) => (
  <div className={css(styles.root)}>
    <h3><Link to={`/post/${post.slug}`} className={css(styles.title)}> {post.title} </Link></h3>
  </div>
)

const styles = StyleSheet.create({
  root: {
    margin: '0 auto 1.5rem'
  },
  title: {
    fontSize: 28,
    textDecoration: 'none',
    lineHeight: '1.2',
    margin: '0 0 1.5rem',
    color: '#000',
    transition: '.3s opacity ease',
    ':hover': {
      opacity: 0.5
    }
  }
})

export default PostListItem
