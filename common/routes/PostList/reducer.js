import * as types from '../../constants'
import { combineReducers } from 'redux'

const ids = (state = [], action) => {
  switch (action.type) {
    case types.LOAD_POSTS_REQUEST:
    case types.LOAD_POSTS_FAILURE:
      return state
    case types.LOAD_POSTS_SUCCESS:
      return action.payload.result
    default:
      return state
  }
}

const byId = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_POSTS_REQUEST:
    case types.LOAD_POSTS_FAILURE:
      return state
    case types.LOAD_POSTS_SUCCESS:
      return { ...state, ...action.payload.entities.post }
    default:
      return state
  }
}

const isFetching = (state = false, action) => {
  switch (action.type) {
    case types.LOAD_POSTS_REQUEST:
      return true
    case types.LOAD_POSTS_SUCCESS:
    case types.LOAD_POSTS_FAILURE:
      return false
    default:
      return state
  }
}

const errorMessage = (state = null, action) => {
  switch (action.type) {
    case types.LOAD_POSTS_FAILURE:
      return action.error.message
    case types.LOAD_POSTS_SUCCESS:
    case types.LOAD_POSTS_REQUEST:
      return null
    default:
      return state
  }
}

export const getPostBySlug = (state, slug) => state.posts.byId[slug]
export const getPosts = (state) => {
  return state.posts.ids.map(id => getPostBySlug(state, id))
}
export const getIsFetching = (state) => state.isFetching
export const getErrorMessage = (state) => state.errorMessage

const posts = combineReducers({
  isFetching,
  errorMessage,
  ids,
  byId
})

export default posts
