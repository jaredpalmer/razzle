import { LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE } from '../../constants'
import axios from 'axios'

export function loadPost (slug) {
  // return {
  //   [CALL_API]: {
  //     // Types of actions to emit before and after
  //     types: [LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE],
  //     // Perform the fetching:
  //     url: `/api/v0/posts/${slug}`,
  //     method: 'GET',
  //     withCredentials: true
  //   }
  // }
  return (dispatch, getState) => {
    const { protocol, host } = getState().sourceRequest
    dispatch({ type: LOAD_POST_REQUEST })
    return axios.get(`${protocol}://${host}/api/v0/posts/${slug}`)
      .then(res => {
        dispatch({
          type: LOAD_POST_SUCCESS,
          payload: res.data,
          meta: {
            lastFetched: Date.now()
          }
        })
      })
      .catch(error => {
        console.error(`Error in reducer that handles ${LOAD_POST_SUCCESS}: `, error)
        dispatch({
          type: LOAD_POST_FAILURE,
          payload: error,
          error: true
        })
      })
  }
}
