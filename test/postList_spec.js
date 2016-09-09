import chai, { expect } from 'chai'
import * as types from '../common/constants'
import reducer from '../common/routes/PostList/reducer'

// Remove this
import fakeDB from '../server/fakeDB.js'

describe('PostList Reducer', () => {
  const initialState = {
    lastFetched: null,
    isLoading: false,
    error: null,
    data: []
  }

  it('should return default state if action is undefined', () => {
    const nextState = reducer(initialState, 'BLAH')
    expect(nextState).to.deep.equal(initialState)
  })

  it('should handle LOAD_POSTS_REQUEST', () => {
    const action = {
      type: types.LOAD_POSTS_REQUEST
    }

    const expectedNextState = {
      lastFetched: null,
      isLoading: true,
      error: null,
      data: []
    }

    const nextState = reducer(initialState, action)
    expect(nextState).to.deep.equal(expectedNextState)
  })

  it('should handle LOAD_POSTS_SUCCESS', () => {
    const currentTime = Date.now()

    const action = {
      type: types.LOAD_POSTS_SUCCESS,
      payload: fakeDB,
      meta: {
        lastFetched: currentTime
      }
    }

    const expectedNextState = {
      lastFetched: currentTime,
      isLoading: false,
      error: null,
      data: fakeDB
    }

    const nextState = reducer(initialState, action)
    expect(nextState).to.deep.equal(expectedNextState)
  })

  it('should handle LOAD_POSTS_FAILURE', () => {
    const error = new Error('Invalid request')
    const action = {
      type: types.LOAD_POSTS_FAILURE,
      payload: error,
      error: true
    }

    const expectedNextState = {
      lastFetched: null,
      isLoading: false,
      error: error,
      data: []
    }
    const nextState = reducer(initialState, action)
    expect(nextState).to.deep.equal(expectedNextState)
  })
})
