# React Production Starter

[![Build Status](https://travis-ci.org/jaredpalmer/react-production-starter.svg?branch=master)](https://travis-ci.org/jaredpalmer/react-production-starter)

An example react application (master-detail feed) with isomorphic rendering, async react-router routes, async redux reducers, async data fetching, and code-splitting.

#### Motivation
The file size of isomorphic React apps can quickly get out of hand. Many isomorphic starter kits look awesome to begin with but yield a several megabyte javascript file for the client to download. This project aims to demonstrate some possible solutions.

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
 - [Webpack](https://github.com/webpack/webpack) with code splitting
 - [React Hot Loader](https://github.com/gaearon/react-hot-loader)

#### Inspiration
 - [example-react-router-server-rendering-lazy-routes](https://github.com/ryanflorence/example-react-router-server-rendering-lazy-routes) by [@ryanflorence](https://twitter.com/ryanflorence)
 - [Cake's approach to React Router server rendering w/code splitting and Redux](https://gist.github.com/rgrove/3e612aa366541845161c) by [@rgrove](https://twitter.com/yaypie)
 - [How to dynamically load reducers for code splitting in a Redux application?](http://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application) by [@dan_abramov](https://twitter.com/dan_abramov)

#### Folder Structure:
```
.
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

### Getting started
```bash
git clone https://github.com/jaredpalmer/react-production-starter MyApp
cd MyApp
npm install
npm start

# Open localhost:5000
```

More docs soon. PRs welcome!
