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
        error: { $set: null }
      });
    case types.LOAD_POST_SUCCESS:
      return update(state, {
        data: { $set: action.body },
        lastFetched: { $set: action.lastFetched },
        isLoading: { $set: false },
      });
    case types.LOAD_POST_FAILURE:
      return update(state, {
        error: { $set: action.error },
      });
    default:
      return state;
  }
}
