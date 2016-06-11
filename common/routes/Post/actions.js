import { LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE } from '../../constants'
import { normalize } from 'normalizr'
import * as schema from '../PostList/schema'
import { getPostBySlug } from '../PostList/reducer'

export function loadPost (slug) {
  return (dispatch, getState, { axios }) => {
    const { protocol, host } = getState().sourceRequest
    // Only fetch if the post doesn't already exist in state
    if (getPostBySlug(getState(), slug)) {
      return
    }

    dispatch({ type: LOAD_POSTS_REQUEST })
    return axios.get(`${protocol}://${host}/api/v0/posts/${slug}`)
      .then(res => {
        dispatch({
          type: LOAD_POSTS_SUCCESS,
          payload: normalize(res.data, schema.post),
          meta: {
            lastFetched: Date.now()
          }
        })
      })
      .catch(error => {
        console.error(`Error in reducer that handles ${LOAD_POSTS_SUCCESS}: `, error)
        dispatch({
          type: LOAD_POSTS_FAILURE,
          payload: error,
          error: true
        })
      })
  }
}
