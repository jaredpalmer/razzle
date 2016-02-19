import {
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE
} from '../../constants';

require('es6-promise');
import fetch from 'isomorphic-fetch';

// Caching logic
function shouldFetchPosts(state) {
  if (state.posts.data === null) {
    return true;
  } else if (state.posts.isLoading) {
    return false;
  } else {
    return true;
  }
}

export function loadPosts() {
  return {
    // Types of actions to emit before and after
    types: [LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE],

    // Check the cache (optional):
    // shouldCallAPI: (state) => state.posts.data.length === 0 && !state.posts.isLoading,

    // Perform the fetching:
    callAPI: () => fetch('http://127.0.0.1:5000/api/v0/posts').then(req => req.json()),

    // Arguments to inject in begin/end actions
    payload: {},
  };
}
