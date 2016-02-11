import {
  FETCH_POSTLIST_REQUEST,
  FETCH_POSTLIST_FAILURE,
  FETCH_POSTLIST_SUCCESS,
} from '../constants';
import axios from 'axios';

export function postListRequest(isLoading) {
  return {
    type: FETCH_POSTLIST_REQUEST,
    isLoading: isLoading,
  };
}

export function postListSuccess(data) {
  return {
    type: FETCH_POSTLIST_SUCCESS,
    lastFetched: new Date(),
    data,
  };
}

export function postListFailure(error) {
  return {
    type: FETCH_POSTLIST_FAILURE,
    error,
  };
}

export function fetch() {
  return function (dispatch, getState) {
    dispatch(postListRequest(true));
    return axios.get('http://localhost:5000/api/v0/posts')
      .then(function (result) {
        console.log(result.data);
        return result.data;
      })
      .then(function (jsonResult) {
        dispatch(postListSuccess(jsonResult));
      })
      .catch(function (err) {
        dispatch(postListFailure(err));
      });
  };
}
