# API Middleware

The API middleware builds upon the middleware from the [redux real world example middleware](https://github.com/reactjs/redux/blob/ad33fa7314e5db852a306d9475be5cfe22bde180/examples/real-world/middleware/api.js).

| Feature                        | Redux Real World | React Production Starter |
|--------------------------------|------------------|--------------------------|
| Under-the-hood                 | Isomorphic Fetch | Axios                    |
| HTTP Verbs                     | `GET`            | All                      |
| Produces Flux Standard Actions | NO               | YES                      |


Here is what a simple `GET` request would look like:

```javascript
// GET Request
import {
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE
} from '../../constants';
import { CALL_API } from '../../middleware/api'

export function loadPosts(slug) {
  return {
    [CALL_API]: {
      // Types of actions to emit before and after
      types: [LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE],

      // refer to axios documentation
      url: `/api/v0/posts/${slug}`,
      method: 'GET'

      // withCredentials
    }
  }
}
```

Example of a `POST` request:
```javascript
// POST Request
import {
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE
} from '../../constants';
import { CALL_API } from '../../middleware/api'

export function createPost(title, body) {
  return {
    [CALL_API]: {
      // Types of actions to emit before and after
      types: [CREATE_POST_REQUEST, CREATE_POST_SUCCESS, CREATE_POST_FAILURE],

      // refer to axios documentation for all options
      url: '/api/v0/posts',
      method: 'POST'
      data: { title, body } // body of the post
      // withCredentials: true // depending on your cookie/session config
    }
  }
}
```

Inside of `CALL_API`, you must specify:
 - `types` and pass it 3 strings that representing request, success, and error actions to be emitted).
 - `url` - the url endpoint
 - `method` - an HTTP Verb

For your reference, the middleware eventually calls `axios(options).then(...)`, thus **you are free to supply any/all axios API options**
