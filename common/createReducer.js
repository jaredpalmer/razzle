import { combineReducers } from 'redux'

const sourceRequest = (state = {
  host: '',
  protocol: ''
}, action) => state

// Only combine reducers needed for initial render, others will be
// added async
export default function createReducer (asyncReducers) {
  return combineReducers({
    sourceRequest,
    ...asyncReducers
  })
}
