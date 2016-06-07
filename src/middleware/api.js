import axios from 'axios'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

function getUrl(path) {
  if (path.startsWith('http') || canUseDOM) {
    return path;
  }

  return process.env.WEBSITE_HOSTNAME ?
    `http://${process.env.WEBSITE_HOSTNAME}${path}` :
    `http://127.0.0.1:${global.server.get('port')}${path}`;
}

function request(options) {
  const realURL = getUrl(options.url)
  options.url = realURL
  return axios(options).then(res => res.data)
}

export const CALL_API = Symbol('Call API')

export default store => next => action => {
  const callAPI = action[CALL_API]

  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  const { types, ...rest  } = callAPI

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }

  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  const [requestType, successType, failureType] = types

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  next(actionWith({ type: requestType }))

  return request(rest)
    .then(
      res => next(actionWith({
        type: successType,
        payload: res,
        meta: {
          lastFetched: Date.now()
        }
      }))
    ).catch(error => {
      console.log(`Error in reducer that handles ${requestType}: `, error)
      next(actionWith({
        type: failureType,
        payload: error,
        error: true
      }))
    })
  }
