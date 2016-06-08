import { provideHooks } from 'redial'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadPost } from '../actions'
import { StyleSheet, css } from 'aphrodite'
import Helmet from 'react-helmet'
import NotFound from '../../../components/NotFound'
import { selectCurrentPost } from '../reducer'

const redial = {
  fetch: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug))
}

const mapStateToProps = state => selectCurrentPost(state)

const PostPage = ({ title, content, isLoading, error }) => {
  if (!error) {
    return (
      <div>
        <Helmet title={title} />
        {isLoading &&
          <div>
            <h2 className={css(styles.loading)}>Loading....</h2>
          </div>}
        {!isLoading &&
          <div>
            <h2 className={css(styles.title)}>{title}</h2>
            <p className={css(styles.content)}>{content}</p>
          </div>}
      </div>
    )
  } else {
    // maybe check for different types of errors and display appropriately
    return <NotFound />
  }
}

PostPage.propTypes = {
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

export default provideHooks(redial)(connect(mapStateToProps)(PostPage))
