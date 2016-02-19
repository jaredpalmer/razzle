import {
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
} from '../../constants';
require('es6-promise');
import fetch from 'isomorphic-fetch';

function shouldFetchPost(state) {
  if (state.currentPost.isLoading) {
    return false;
  } else {
    return state.currentPost.didInvalidate;
  }
}

export function loadPost(slug) {
  return {
    // Types of actions to emit before and after
    types: ['LOAD_POST_REQUEST', 'LOAD_POST_SUCCESS', 'LOAD_POST_FAILURE'],

    // Check the cache (optional):
    // shouldCallAPI: (state) => shouldFetchPost(state),

    // Perform the fetching:
    callAPI: () => fetch(`http://127.0.0.1:5000/api/v0/post/${slug}`).then(req => req.json()),

    // Arguments to inject in begin/end actions
    payload: { slug },
  };
}
