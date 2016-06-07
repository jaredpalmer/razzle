# API Middleware

The API middleware builds upon the middleware from the [redux real world example middleware](https://github.com/reactjs/redux/blob/ad33fa7314e5db852a306d9475be5cfe22bde180/examples/real-world/middleware/api.js).

| Feature                        | Redux Real World | React Production Starter |
|--------------------------------|------------------|--------------------------|
| Under-the-hood                 | Isomorphic Fetch | Axios                    |
| HTTP Verbs                     | `GET`            | All                      |
| Produces Flux Standard Actions | NO               | YES                      |

```javascript
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
    }
  }
}
```

Inside of `CALL_API`, you must specify:
 - `types` and pass it 3 strings (representing request, success, and error outcomes).
 - `url` - the url endpoint
 - `method` - an HTTP Verb

For your reference, the middleware eventually calls `axios(options).then(...)`, thus **you are free to supply any/all axios API options**
