export default client => ({ dispatch, getState }) => next => action => {
  const {
    callAPI,
    types,
    shouldCallAPI = () => true,
    ...rest
  } = action

  if (!callAPI) return next(action)

  const [requestType, successType, failureType] = types;

  next({ ...rest, type: requestType })

  if (!shouldCallAPI(getState())) {
    return next(action)
  }

  return callAPI(client)
    .then(
      res => next({
        ...rest,
        payload: res.data,
        lastFetched: Date.now(),
        type: successType
      }),
      error => next({
        ...rest,
        error,
        type: failureType
      })
    )
    .catch(error => {
      console.log(`Error in reducer that handles ${type}: `, error)
      next({ ...rest, error, type: failureType })
    })
}
