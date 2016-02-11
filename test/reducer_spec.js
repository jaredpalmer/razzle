import { expect } from 'chai';
import * as actions from '../src/actions/PostActions';
import * as types from '../src/constants';
import update from 'react/lib/update';
import posts from '../src/reducers';

// Remove this
import fakeDB from '../src/fakeDB.js';

describe('REDUCERS', () => {

  describe('PostList Reducer', () => {

    it('should return default state if action is undefined', () => {
      const initialState = [];
      const nextState = posts(initialState, 'BLAH');
      expect(nextState).to.deep.equal(initialState);
    });

    it('should handle FETCH_POSTLIST_REQUEST', () => {
      const initialState = {
        lastFetched: null,
        isLoading: false,
        error: null,
        data: [],
      };
      const nextState = posts(initialState, actions.postListRequest(true));
      expect(nextState).to.deep.equal({
        lastFetched: null,
        isLoading: true,
        error: null,
        data: [],
      });
    });

    it('should handle FETCH_POSTLIST_SUCCESS', () => {
      const initialState = {
        lastFetched: null,
        isLoading: false,
        error: null,
        data: [],
      };
      const nextState = posts(initialState, actions.postListSuccess(fakeDB));
      expect(nextState).to.deep.equal({
        lastFetched: new Date(),
        isLoading: false,
        error: null,
        data: fakeDB,
      });
    });

    it('should handle FETCH_POSTLIST_FAILURE', () => {
      const initialState = {
        lastFetched: null,
        isLoading: false,
        error: null,
        data: [],
      };
      const e = {
        error: 'Invalid Request',
        message: 'Something went wrong',
      };
      const nextState = posts(initialState, actions.postListFailure(e));
      expect(nextState).to.deep.equal({
        lastFetched: null,
        isLoading: false,
        error: e,
        data: [],
      });
    });

  });

});
