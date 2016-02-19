# React Production Starter

While there are tons of react/redux/react-router boilerplates on Github, this one is built to scale: it comes with multiple entry points (a.k.a. codesplitting), asynchronous "lazy" react-router routes, and asynchronous redux reducers. These features allow you to separate your app into as many mini-apps as you'd like to without affecting initial page load.

Out of the box, the app is client-side only. However, refactoring to a universal (isomorphic) app is relatively straightforward. The only thing you'll have to decide on is which data-resolving logic you want. See `server-iso.js`, `client-iso.js`, `routes-iso.js` for an example that uses Redial (formerly react-fetchr).


Folder Structure: 
```bash
.
├── /build/                     # The folder for compiled output
├── /node_modules/              # 3rd-party libraries and utilities
├── /src/                       # The source code of the application
│   ├── /components/            # Global React components
│   ├── /reducers/              # Synchronous reducers (reducers required for initial page load)
│   ├── /middleware/            # Redux middleware (comes with callAPIMiddileware)
│   ├── /routes/                # React-router routes
│   |   ├── /App/               # Main wrapper component
│   |   ├── /PostList/          # PostList page
│   |   ├── /Editor/            # Editor (async stub)
│   |   ├── /Post/              # Post (async)
│   |   |   ├── /components/    # Post components (async)
│   |   |   ├── actions.js      # Post actions (async)
│   |   |   ├── reducer.js      # Post reducer (async)
│   |   |   ├── index.js        # Post Route (async)
│   |   ├── /root.js            # React-router root 
│   ├── /client.js              # Client-side entry point
│   ├── /store.js               # Redux store configuration
│   ├── /constants.js           # Global constants (Action types, Aphrodite layout/style vars)
│   ├── /(routes-iso.js)        # (Synchronous vanilla react-router routes, in case you want to use those)
│   ├── /server/                # Server
│   |   ├── /api/               # API endpoints
│   |   |   ├── /posts.js       # Posts endpoint
│   |   |   ├── /post.js        # Single Post endpoint
│   |   ├── /fakeDB.js          # Database Stub
│   |   ├── /server.js          # Express app
│   |   ├── /server-iso.js      # Express app with isomorphic rendering (must use routes-iso.js)
│   |   ├── /index.js           # Server entry point (with babel-register)
├── /test/                      # Mocha tests (e.g. xxx_spec.js)
├── /coverage/                  # Code coverage data
│── .env                        # **Server-side configuration variables**
│── Procfile                    # Heroku startup commands
│── package.json                # The list of 3rd party libraries and utilities and NPM scripts
│── webpack.config.dev.js       # Webpack Development Configuration File
└── webpack.config.prod.js      # Webpack Production Configuration File
```
