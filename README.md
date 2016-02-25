# React Production Starter

This is an example react application (master-detail feed) with isomorphic rendering, async react-router routes, async redux reducers, async data fetching, and code-splitting.

#### Motivation
Most React-Redux boilerplates face two non-trivial issues as they grow in size: 

* **Performance Degradation:** Regardless of which page is in actually in-view, end-users have to download 100% of your app's business logic and CSS.
* **Security Challenges:** Business logic related to protected or admin-only routes is still exposed to average users.

Webpack and react-router suggest using code-splitting and lazy routes to address these issues. However, making Redux work well in this kind of application structure requires some extra effort. This project aims to demonstrate a possible solution.

#### Under the Hood
 - [Node.js](https://nodejs.org/en/)
 - [Express](https://github.com/expressjs/express)
 - [React](https://github.com/facebook/react)
 - [Redux](https://github.com/reactjs/redux)
 - [React Router](https://github.com/reactjs/react-router) 2.0
 - [Aphrodite](https://github.com/Khan/aphrodite) for CSS by Khan Academy
 - [React Helmet](https://github.com/nfl/react-helmet) for meta tags by the NFL
 - [Redial](https://github.com/markdalgleish/redial) for data fetching by [@markdalgleish](https://twitter.com/markdalgleish)
 - [Babel 6](https://github.com/babel/babel)
 - [Webpack](https://github.com/webpack/webpack) with multiple entry points and common chunks + [React Hot Loader](https://github.com/gaearon/react-hot-loader)


### Getting started
```bash
git clone https://github.com/jaredpalmer/react-production-starter MyApp
cd MyApp
npm install
npm start

# Open localhost:5000
```

### Walkthrough

In a 'vanilla' Redux application you usually combine reducers into a `rootReducer` for your entire application like this:

```javascript
// Vanilla Redux rootReducer
// reducers/index.js
import { combineReducers } from 'redux';
import profile from './profile';
import feed from './feed';
import settings from './settings';
import admin from './admin';

export default function combineReducers({
  profile,
  feed,
  settings,
  admin
});
```

This is what an "async reducer" looks like. 

```javascript
// Async Redux reducer (supports code-splitting)
// createReducer.js
import feed from './routes/Feed/reducer';
import { combineReducers } from 'redux';

// Only combine reducers needed for initial render, 
// others will be if needed
export default function createReducer(asyncReducers) {
  return combineReducers({
    feed,
    ...asyncReducers,
  });
}
```

This lets you add reducer's on-demand instead of all at once, making it ideal for code splitting. In addition to modifying your Redux root reducer you also need to modify your Redux store configuration as follows:

```javascript
// store.js
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import callAPIMiddleware from './middleware/callAPIMiddleware';
import createReducer from './createReducer';

export function configureStore(initialState = {}) {
  let store = createStore(createReducer(), initialState, compose(
    applyMiddleware(
      thunk,
      callAPIMiddleware
    ),
  ));
  store.asyncReducers = {};
  return store;
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
```

Now you just wrap routes that have reducers in a function:

```javascript
// routes/root.js
import App from '../components/App'; // route container component
import Feed from './Feed';

// routes with reducers become functions of the store
export default function createRoutes(store) {
  const root = {
    path: '/',
    component: App,
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          require('./Profile').default(store), // ***add async reducer***
          require('./About').default, // no need to modify store, no reducer
          require('./Terms').default, // no need to modify store, no reducer
          require('./Contact').default, // no need to modify store, no reducer
        ]);
      });
    },
    indexRoute: {
      component: Feed,
    },
  };

  return root;
}
```

```javascript
// Example child route with an async reducer
// route/Profile/index.js
import { injectAsyncReducer } from '../../store';

// takes a store object and injects its reducer asynchronously
export default function createRoutes(store) {
  return {
    path: 'users/:username',
    getComponents(location, cb) {
      require.ensure([
          './containers/Profile',
          './reducer',
        ], (require) => {
          let Profile = require('./containers/Profile').default;
          let profileReducer = require('./reducer').default;
          injectAsyncReducer(store, 'currentProfile', profileReducer);
          cb(null, Profile);
        });
    },
  };
}
```

Bam. You now have asynchronous on-demand reducers and lazy routing. You can now scale your app as your team grows without affecting initial page load. 

### How does data fetching work?
React Production Starter uses [@markdalgleish](https://twitter.com/markdalgleish)'s [Redial](https://github.com/markdalgleish/redial) (formerly react-fetcher) for data fetching on the server and client. See the docs for more information. My implementation is almost identical to the one suggested in the documentation.

#### Folder Structure:   
```bash
├── /build/                     # The folder for compiled output
├── /node_modules/              # 3rd-party libraries and utilities
├── /src/                       # The source code of the application
│   ├── /components/            # Global React components
│   ├── /middleware/            # Redux middleware (comes with callAPIMiddileware)
│   ├── /routes/                # React-router routes
│   |   ├── /PostList/          # PostList page
│   |   ├── /Edit/              # Edit page (stub)
│   |   ├── /Post/              # Post (async)
│   |   |   ├── /components/    # Post components (async)
│   |   |   ├── actions.js      # Post actions (async)
│   |   |   ├── reducer.js      # Post reducer (async)
│   |   |   ├── index.js        # Post Route (async)
│   |   ├── /root.js            # React-router root
│   ├── /client.js              # Client-side entry point
│   ├── /store.js               # Async store configuration
│   ├── /constants.js           # Global constants (Action types, Aphrodite layout/style vars)
│   ├── /createReducer.js       # Like rootReducer, but async
│   ├── /server/                # Server
│   |   ├── /api/               # API endpoints
│   |   |   ├── /posts.js       # Posts endpoint
│   |   |   ├── /post.js        # Single Post endpoint
│   |   ├── /fakeDB.js          # Database Stub
│   |   ├── /server.js          # Express app
│   |   ├── /index.js           # Server entry point (with babel-register)
├── /test/                      # Mocha tests (e.g. xxx_spec.js)
├── /coverage/                  # Code coverage data
│── .env                        # **Server-side configuration variables**
│── Procfile                    # Heroku startup commands
│── package.json                # The list of 3rd party libraries and utilities and NPM scripts
│── webpack.config.dev.js       # Webpack Development Configuration File
└── webpack.config.prod.js      # Webpack Production Configuration File
```

#### Inspiration
 - [example-react-router-server-rendering-lazy-routes](https://github.com/ryanflorence/example-react-router-server-rendering-lazy-routes) by [@ryanflorence](https://twitter.com/ryanflorence)
 - [Cake's approach to React Router server rendering w/code splitting and Redux](https://gist.github.com/rgrove/3e612aa366541845161c) by [@rgrove](https://twitter.com/yaypie)
 - [How to dynamically load reducers for code splitting in a Redux application?](http://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application) by [@dan_abramov](https://twitter.com/dan_abramov)
