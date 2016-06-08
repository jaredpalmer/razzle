import * as types from '../../constants'
import update from 'react/lib/update'

export default function posts (state = {
  data: [],
  lastFetched: null,
  isLoading: false,
  error: null
}, action) {
  switch (action.type) {
    case types.LOAD_POSTS_REQUEST:
      return update(state, {
        isLoading: { $set: true }
      })
    case types.LOAD_POSTS_SUCCESS:
      return update(state, {
        data: { $set: action.payload },
        lastFetched: { $set: action.meta.lastFetched },
        isLoading: { $set: false }
      })
    case types.LOAD_POSTS_FAILURE:
      return update(state, {
        error: { $set: action.payload }
      })
    default:
      return state
  }
}

// Posts Selector
export const selectPosts = (state) => {
  return state.posts.data
}
