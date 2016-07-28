import { combineReducers } from 'redux-immutable'
import { fromJS } from 'immutable'

const initialState = fromJS({
  host: '',
  protocol: ''
})

const sourceRequest = (state = initialState, action) => state

// Only combine reducers needed for initial render, others will be
// added async
export default function createReducer (asyncReducers) {
  return combineReducers({
    sourceRequest,
    ...asyncReducers
  })
}
