import * as types from '../../constants';
import update from 'react/lib/update';

export default function currentPost(state = {
  lastFetched: null,
  isLoading: false,
  error: null,
  didInvalidate: true,
  data: {
    id: 'abcd190d',
    title: 'How\'s business? Boomin',
    slug: 'hows-business-boomin',
    content: 'Put it this way, it took me twenty five years to get these plants, twenty five years of blood sweat and tears, and I’m never giving up, I’m just getting started. I’m up to something. Fan luv. Lion! The key is to drink coconut, fresh coconut, trust me. Cloth talk. You see the hedges, how I got it shaped up? It’s important to shape up your hedges, it’s like getting a haircut, stay fresh.',
  },
}, action) {
  switch (action.type) {
    case types.LOAD_POST_REQUEST:
      return update(state, {
        isLoading: { $set: true },
        didInvalidate: { $set: false },
      });
    case types.LOAD_POST_SUCCESS:
      return update(state, {
        data: { $set: action.data },
        lastFetched: { $set: action.lastFetched },
        didInvalidate: { $set: false },
        isLoading: { $set: false },
      });
    case types.LOAD_POST_FAILURE:
      return update(state, {
        error: { $set: action.error },
      });
    case types.INVALIDATE_POST:
      return update(state, {
        didInvalidate: { $set: true },
      });
    default:
      return state;
  }
}
