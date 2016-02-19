import * as types from '../../constants';
import update from 'react/lib/update';

export default function currentPost(state = {
  lastFetched: null,
  isLoading: false,
  error: null,
  data: {},
}, action) {
  switch (action.type) {
    case types.LOAD_POST_REQUEST:
      return update(state, {
        isLoading: { $set: true },
      });
    case types.LOAD_POST_SUCCESS:
      return update(state, {
        data: { $set: action.data },
        lastFetched: { $set: action.lastFetched },
        isLoading: { $set: false },
      });
    case types.LOAD_POST_FAILURE:
      return update(state, {
        error: { $set: action.error },
      });
    case types.INVALIDATE_POST:
      return update(state, {
        data: { $set: {} },
      });
    default:
      return state;
  }
}
