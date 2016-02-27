import {
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
} from '../../constants';
import http from '../../utils/HttpClient';

export function loadPost(slug) {
  return {
    // Types of actions to emit before and after
    types: [LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE],

    // Check the cache (optional):
    // shouldCallAPI: (state) => shouldFetchPost(state),

    // Perform the fetching:
    callAPI: () => http.get(`/api/v0/post/${slug}`),

    // Arguments to inject in begin/end actions
    payload: { slug },
  };
}
