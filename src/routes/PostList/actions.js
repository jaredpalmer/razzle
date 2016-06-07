import {
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE
} from '../../constants';
import { CALL_API } from '../../middleware/api'

export function loadPosts() {
  return {
    [CALL_API]: {
      // Types of actions to emit before and after
      types: [LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE],
      // Perform the fetching:
      url: '/api/v0/posts',
      method: 'GET'
    }
  }
}
