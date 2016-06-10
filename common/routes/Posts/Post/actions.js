import { LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE } from '../../../constants'
import axios from 'axios'

import { normalize } from 'normalizr';
import * as schema from '../schema';

export function loadPost (slug) {
  return (dispatch, getState) => {
    const { protocol, host } = getState().sourceRequest
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
        console.error(`Error in reducer that handles ${LOAD_POST_SUCCESS}: `, error)
        dispatch({
          type: LOAD_POSTS_FAILURE,
          payload: error,
          error: true
        })
      })
  }
}
