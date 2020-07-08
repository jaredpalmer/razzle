# Arguments

By default, `key` will be passed to `fetcher` as the argument. So the following 3 expressions are equivalent:

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

## Multiple Arguments

In some scenarios, it's useful pass multiple arguments (can be any value or object) to the `fetcher` function. 
For example an authorized fetch request:

```js
useSWR('/api/user', url => fetchWithToken(url, token))
```

This is **incorrect**. Because the identifier (also the cache key) of the data is `'/api/data'`, 
so even if `token` changes, SWR will still use the same key and return the wrong data. 

Instead, you can use an **array** as the `key` parameter, which contains multiple arguments of `fetcher`:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
```

The function `fetchWithToken` still accepts the same 2 arguments, but the cache key will also be associated with `token` now.

## Passing Objects

Say you have another function that fetches data with a user scope: `fetchWithUser(api, user)`. You can do the following:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
// ...and pass it as an argument to another query
const { data: orders } = useSWR(user ? ['/api/orders', user] : null, fetchWithUser)
```

The key of the request is now the combination of both values. SWR **shallowly** compares
the arguments on every render, and triggers revalidation if any of them has changed.  
Keep in mind that you should not recreate objects when rendering, as they will be treated as different objects on every render:

```js
// Don’t do this! Deps will be changed on every render.
useSWR(['/api/user', { id }], query)

// Instead, you should only pass “stable” values.
useSWR(['/api/user', id], (url, id) => query(url, { id }))
```

Dan Abramov explains dependencies very well in [this blog post](https://overreacted.io/a-complete-guide-to-useeffect/#but-i-cant-put-this-function-inside-an-effect).
