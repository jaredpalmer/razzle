import * as types from '../../constants'
import { fromJS } from 'immutable'

const initialState = fromJS({
  lastFetched: null,
  isLoading: false,
  error: null,
  title: '',
  content: ''
})

export default function currentPost (state = initialState, action) {
  switch (action.type) {
    case types.LOAD_POST_REQUEST:
      return state
        .set('isLoading', true)
        .set('error', null)
    case types.LOAD_POST_SUCCESS:
      return state
        .set('title', action.payload.title)
        .set('content', action.payload.content)
        .set('lastFetched', action.meta.lastFetched)
        .set('isLoading', false)
    case types.LOAD_POST_FAILURE:
      return state.set('error', action.payload)
    default:
      return state
  }
}

// Example of a co-located selector
// return immutable map as plain JS object
export const selectCurrentPost = state => state.get('currentPost').toJS()
