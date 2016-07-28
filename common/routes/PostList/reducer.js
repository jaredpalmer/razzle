import * as types from '../../constants'
import Immutable, { List, Map } from 'immutable'

const initialState = Map({
  data: List(),
  lastFetched: null,
  isLoading: false,
  error: null
})

export default function posts (state = initialState, action) {
  switch (action.type) {
    case types.LOAD_POSTS_REQUEST:
      return state.set('isLoading', true)
                  .set('error', null)
    case types.LOAD_POSTS_SUCCESS:
      return state.set('data', Immutable.fromJS(action.payload))
                  .set('lastFetched', action.meta.lastFetched)
                  .set('isLoading', false)
    case types.LOAD_POSTS_FAILURE:
      return state.set('error', action.payload)
    default:
      return state
  }
}

// Example of a co-located selector
export const selectPosts = state => state.posts.toJS()
