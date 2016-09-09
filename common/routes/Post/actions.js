import { LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE } from '../../constants'

export function loadPost (slug) {
  return (dispatch, getState, { axios }) => {
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
