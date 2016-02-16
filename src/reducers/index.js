import posts from './posts';
import stub from './stub';
import { combineReducers } from 'redux';

export default function createReducer(asyncReducers) {
  return combineReducers({
    posts,
    stub,
    ...asyncReducers,
  });
}
