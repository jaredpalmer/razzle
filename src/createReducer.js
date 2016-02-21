import posts from './routes/PostList/reducer';
import { combineReducers } from 'redux';

// Only combine reducers needed for initial render, others will be
// added async
export default function createReducer(asyncReducers) {
  return combineReducers({
    posts,
    ...asyncReducers,
  });
}
