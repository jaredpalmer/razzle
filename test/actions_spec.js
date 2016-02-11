import { expect } from 'chai';
import * as actions from '../src/actions/PostActions';
import * as types from '../src/constants';

// Remove this
import fakeDB from '../src/fakeDB.js';

describe('ACTIONS', () => {

  describe('PostList Actions', () => {

    it('should create FETCH_POSTLIST_REQUEST', () => {
      const expectedAction = {
        type: types.FETCH_POSTLIST_REQUEST,
        isLoading: true,
      };
      expect(actions.postListRequest(true)).to.deep.equal(expectedAction);
    });

    it('should create FETCH_POSTLIST_SUCCESS', () => {
      const expectedAction = {
        type: types.FETCH_POSTLIST_SUCCESS,
        data: fakeDB,
        lastFetched: new Date(),
      };
      expect(actions.postListSuccess(fakeDB)).to.deep.equal(expectedAction);
    });

    it('should create FETCH_POSTLIST_FAILURE', () => {
      const e = {
        error: 'Invalid Request',
        message: 'Something went wrong',
      };
      const expectedAction = {
        type: types.FETCH_POSTLIST_FAILURE,
        error: e,
      };
      expect(actions.postListFailure(e)).to.deep.equal(expectedAction);
    });

  });

});
