import {
  POSTLIST_REQUEST,
  POSTLIST_FAILURE,
  POSTLIST_SUCCESS,
} from '../constants';

export function postListRequest(isLoading) {
  return {
    type: POSTLIST_REQUEST,
    isLoading: isLoading,
  };
}

export function postListSuccess(data) {
  return {
    type: POSTLIST_SUCCESS,
    lastFetched: new Date(),
    data,
  };
}

export function postListFailure(error) {
  return {
    type: POSTLIST_FAILURE,
    error,
  };
}

export function fetchPostList() {
  return function (dispatch, getState) {
    dispatch(postListRequest(true));
    return http.get('/api/v0/posts', { subject, preheader, date, meta, elements })
      .then(function (result) {
        return result.html;
      })
      .then(function (jsonResult) {
        dispatch(postListSuccess(jsonResult));
      })
      .catch(function (err) {
        dispatch(postListFailure(err));
      });
  };
}
