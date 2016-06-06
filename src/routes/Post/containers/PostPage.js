import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { StyleSheet, css } from 'aphrodite'
import { provideHooks } from 'redial'
import NotFound from '../../../components/NotFound'
import { loadPost } from '../actions'

const redial = {
  fetch: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug))
}

const mapStateToProps = state => ({
  title: state.currentPost.data.title,
  content: state.currentPost.data.content,
  isLoading: state.currentPost.isLoading,
  error: state.currentPost.error
})

const PostPage = ({ title, content, isLoading, error }) => {
  if (!error) {
    return (
      <div>
        <Helmet
          title={title}
        />
        {isLoading &&
          <div>
            <h2 className={css(styles.title)}>Loading....</h2>
            <p className={css(styles.primary)}></p>
          </div>
        }
        {!isLoading &&
          <div>
            <h2 className={css(styles.title)}>{title}</h2>
            <p className={css(styles.body)}>{content}</p>
          </div>
        }
      </div>
    )
  } else {
    // maybe check for different types of errors and display appropriately
    return <NotFound />
  }
}

PostPage.propTypes = {
  title: React.PropTypes.string,
  content: React.PropTypes.string,
  isLoading: React.PropTypes.bool,
  error: React.PropTypes.object
}

const styles = StyleSheet.create({
  body: {
    fontSize: '1.25rem',
    lineHeight: '1.5',
    margin: '1rem 0'
  },
  title: {
    fontSize: '36px',
    margin: '1rem 0',
    color: '#000'
  }
})

export default provideHooks(redial)(connect(mapStateToProps)(PostPage))
