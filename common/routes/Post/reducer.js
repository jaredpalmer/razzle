import * as types from '../../constants'
import update from 'react/lib/update'

export default function currentPost (state = {
  lastFetched: null,
  isLoading: false,
  error: null,
  title: '',
  content: ''
}, action) {
  switch (action.type) {
    case types.LOAD_POST_REQUEST:
      return update(state, {
        isLoading: { $set: true },
        error: { $set: null }
      })
    case types.LOAD_POST_SUCCESS:
      return update(state, {
        title: { $set: action.payload.title },
        content: { $set: action.payload.content },
        lastFetched: { $set: action.meta.lastFetched },
        isLoading: { $set: false }
      })
    case types.LOAD_POST_FAILURE:
      return update(state, {
        error: { $set: action.payload }
      })
    default:
      return state
  }
}

// Example of a co-located selector
export const selectCurrentPost = state => state.currentPost
