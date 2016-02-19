import posts from './posts';
import stub from './stub';
import currentPost from '../routes/Post/actions'
import { combineReducers } from 'redux';

export default function createReducer(asyncReducers) {
  return combineReducers({
    posts,
    stub,
    currentPost,
    ...asyncReducers,
  });
}
