import posts from './posts';
import currentPost from './currentPost';
import { combineReducers } from 'redux';

export default combineReducers({
  currentPost,
  posts,
});
