import { LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE } from '../../constants'
import { CALL_API } from '../../middleware/api'

export function loadPost (slug) {
  return {
    [CALL_API]: {
      // Types of actions to emit before and after
      types: [LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE],
      // Perform the fetching:
      url: `/api/v0/post/${slug}`,
      method: 'GET',
      withCredentials: true
    }
  }
}
