import posts from './posts';
import currentPost from './currentPost';
import stub from './stub';
import { combineReducers } from 'redux';

export default function createReducer(asyncReducers) {
  return combineReducers({
    posts,
    stub,
    ...asyncReducers,
  });
}
