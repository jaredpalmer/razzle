import * as types from '../../constants'
import { combineReducers } from 'redux';
import update from 'react/lib/update'

const data = (state = {}, action) => {
  if (!action.error) {
    return {
      ...state,
      ...action.payload,
    };
  }
  return state;
};

const isFetching = (state = false, action) => {
   switch (action.type) {
     case types.LOAD_POSTS_REQUEST:
       return true;
     case types.LOAD_POSTS_SUCCESS:
     case types.LOAD_POSTS_FAILURE:
       return false;
     default:
       return state;
   }
 }

const errorMessage = (state = null, action) => {
  switch (action.type) {
    case types.LOAD_POSTS_FAILURE:
      return action.error.message
    case types.LOAD_POSTS_SUCCESS:
    case types.LOAD_POSTS_REQUEST:
      return null;
    default:
      return state
  }
}

export const getPostBySlug = (state, slug) => state.posts.data.entities.post[slug]
export const getPosts = (state) => {
  return state.posts.data.result.map(id => getPostBySlug(state, id))
}
export const getIsFetching = (state) => state.isFetching
export const getErrorMessage = (state) => state.errorMessage

const posts = combineReducers({
  isFetching,
  errorMessage,
  data
})


export default posts
