import { expect } from 'chai'
import * as types from '../common/constants'
import reducer from '../common/routes/Post/reducer'

// Remove this
import fakeDB from '../server/fakeDB.js'

describe('Post Reducer', () => {

  it('should return default state if action is undefined', () => {
    const initialState = []
    const nextState = reducer(initialState, 'BLAH')
    expect(nextState).to.deep.equal(initialState)
  })

  it('should handle LOAD_POST_REQUEST', () => {
    const initialState = {
      lastFetched: null,
      isLoading: false,
      error: null,
      title: '',
      content: ''
    }

    const action = {
      type: types.LOAD_POST_REQUEST
    }

    const nextState = reducer(initialState, action)
    expect(nextState).to.deep.equal({
      lastFetched: null,
      isLoading: true,
      error: null,
      title: '',
      content: ''
    })
  })

  it('should handle LOAD_POST_SUCCESS', () => {
    const initialState = {
      lastFetched: null,
      isLoading: false,
      error: null,
      title: '',
      content: ''
    }

    const post = {
      id: '128sd043hd',
      title: 'Cloth Talk Part I',
      slug: 'cloth-talk-part-i',
      content: 'Khaled Ipsum is a major key to success.'
    }

    const currentTime = Date.now()

    const action = {
      type: types.LOAD_POST_SUCCESS,
      payload: post,
      meta: {
        lastFetched: currentTime
      }
    }

    const nextState = reducer(initialState, action)
    expect(nextState).to.deep.equal({
      lastFetched: currentTime,
      isLoading: false,
      error: null,
      title: 'Cloth Talk Part I',
      content: 'Khaled Ipsum is a major key to success.'
    })
  })

  it('should handle LOAD_POST_FAILURE', () => {
    const initialState = {
      lastFetched: null,
      isLoading: false,
      error: null,
      title: '',
      content: ''
    }
    const error = new Error('Invalid request')
    const action = {
      type: types.LOAD_POST_FAILURE,
      payload: error,
      error: true
    }
    const nextState = reducer(initialState, action)
    expect(nextState).to.deep.equal({
      lastFetched: null,
      isLoading: false,
      error: error,
      title: '',
      content: ''
    })
  })
})
