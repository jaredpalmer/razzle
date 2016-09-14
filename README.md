# React Production Starter

[![Build Status](https://travis-ci.org/jaredpalmer/react-production-starter.svg?branch=master)](https://travis-ci.org/jaredpalmer/react-production-starter)  [![Dependency Status](https://david-dm.org/jaredpalmer/react-production-starter.svg)](https://david-dm.org/jaredpalmer/react-production-starter)  [![devDependency Status](https://david-dm.org/jaredpalmer/react-production-starter/dev-status.svg)](https://david-dm.org/jaredpalmer/react-production-starter#info=devDependencies)  [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)  [![Join the chat at https://gitter.im/jaredpalmer/react-production-starter](https://badges.gitter.im/jaredpalmer/react-production-starter.svg)](https://gitter.im/jaredpalmer/react-production-starter?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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
 - [Webpack](https://github.com/webpack/webpack) with vanilla Hot Module Replacement

#### Inspiration
 - [example-react-router-server-rendering-lazy-routes](https://github.com/ryanflorence/example-react-router-server-rendering-lazy-routes) by [@ryanflorence](https://twitter.com/ryanflorence)
 - [Cake's approach to React Router server rendering w/code splitting and Redux](https://gist.github.com/rgrove/3e612aa366541845161c) by [@rgrove](https://twitter.com/yaypie)
 - [How to dynamically load reducers for code splitting in a Redux application?](http://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application) by [@dan_abramov](https://twitter.com/dan_abramov)

### Getting started
```bash
git clone https://github.com/jaredpalmer/react-production-starter MyApp
cd MyApp
npm install
npm start

# Open localhost:5000
```

More docs soon. PRs welcome!
