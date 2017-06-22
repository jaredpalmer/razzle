![Razzle Logo](https://cloud.githubusercontent.com/assets/4060187/26326651/1fc65eca-3f0a-11e7-9f45-02c2bf950418.png)

# Razzle [![CircleCI](https://circleci.com/gh/jaredpalmer/razzle/tree/master.svg?style=svg)](https://circleci.com/gh/jaredpalmer/razzle/tree/master) ![Razzle-status](https://david-dm.org/jaredpalmer/razzle.svg?path=packages/razzle) [![npm version](https://badge.fury.io/js/razzle.svg)](https://badge.fury.io/js/razzle)

Universal JavaScript applications are tough to setup. Either you buy into a framework like [Next.js](https://github.com/zeit/next.js) or [react-server](https://github.com/redfin/react-server), fork a boilerplate, or set things up yourself. Razzle aims to fill this void by abstracting all the required tooling for your universal JavaScript application into a single dependency, and then leaving the rest of the architectural decisions about frameworks, routing, and data fetching up to you.

## Features

Razzle comes with the "battery-pack included" and is part of a complete JavaScript breakfast:

- :fire: Universal Hot Module Replacement, so both the client and server update whenever you make edits. No annoying restarts necessary
- Comes with your favorite ES6 JavaScript goodies (through `babel-preset-razzle`)
- Comes with the same CSS setup as [create-react-app](https://github.com/facebookincubator/create-react-app) 
- Works with [React](https://github.com/facebook/react), **[Reason-React](https://github.com/jaredpalmer/razzle/tree/master/examples/with-reason-react)**, [Preact](https://github.com/developit/preact), [Inferno](https://github.com/infernojs), and [Rax](https://github.com/alibaba/rax) as well as [Angular](https://github.com/angular/angular) and [Vue](https://github.com/vuejs/vue) if that's your thing
- Escape hatches for customization via `.babelrc` and `razzle.config.js`
- [Jest](https://github.com/facebook/jest) test runner setup with sensible defaults via `razzle test`

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Quick Start](#quick-start)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Creating an app](#creating-an-app)
  - [`npm start` or `yarn start`](#npm-start-or-yarn-start)
  - [`npm run build` or `yarn build`](#npm-run-build-or-yarn-build)
  - [`npm run start:prod` or `yarn start:prod`](#npm-run-startprod-or-yarn-startprod)
  - [`npm test` or `yarn test`](#npm-test-or-yarn-test)
- [Customization](#customization)
  - [Extending Babel Config](#extending-babel-config)
  - [Extending Webpack](#extending-webpack)
- [`razzle` API Reference](#razzle-api-reference)
  - [`razzle start`](#razzle-start)
  - [`razzle build`](#razzle-build)
  - [`razzle test`](#razzle-test)
  - [`razzle.config.js`](#razzleconfigjs)
  - [Environment Variables](#environment-variables)
  - [Adding Temporary Environment Variables In Your Shell](#adding-temporary-environment-variables-in-your-shell)
    - [Windows (cmd.exe)](#windows-cmdexe)
    - [Linux, macOS (Bash)](#linux-macos-bash)
  - [Adding Environment Variables In `.env`](#adding-environment-variables-in-env)
    - [What other `.env` files are can be used?](#what-other-env-files-are-can-be-used)
- [How Razzle works (the secret sauce)](#how-razzle-works-the-secret-sauce)
- [Inspiration](#inspiration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Quick Start

```bash
$ npm i -g create-razzle-app

create-razzle-app my-app
cd my-app
npm start
```

or with yarn

```bash
yarn create razzle-app my-app
cd my-app 
yarn start
```

Then open http://localhost:3000/ to see your app. Your console should look like this:

<img src="https://cloud.githubusercontent.com/assets/4060187/26324663/b31788c4-3f01-11e7-8e6f-ffa48533af54.png" width="500px" alt="Razzle Development Mode"/>

When you’re ready to deploy to production, create a minified bundle with `npm run build`.


## Getting Started

### Installation
If you have the latest version of Yarn, you can skip this. Otherwise:

Install Razzle globally:

```
npm i -g create-razzle-app
```

### Creating an app

To create an app, run:

```bash
create-razzle-app my-app
```

or with `yarn create` (new!):

```bash
yarn create razzle-app my-app
```

**You can also bootstrap any one of the [examples](https://github.com/jaredpalmer/razzle/tree/master/examples)
by adding  `--example <example-name>` to your command.**

```bash
create-razzle-app --example with-preact my-app
```

or with `yarn create`

```bash
yarn create razzle-app my-app -- --example with-preact
```

_(The `--` is needed for yarn to ignore options meant for `create-razzle-app`)_

It will create a directory called my-app inside the current folder.  
Inside that directory, it will generate the initial project structure and install the transitive dependencies. 


```
my-app/
  README.md
  node_modules/
  package.json
  .gitignore
  public/
    favicon.ico
    robots.txt
  src/
    App.css
    App.js
    client.js            # Client entry point 
    Home.css
    Home.js 
    server.js .          # Main server code (an Express application)
    react.svg
    index.js             # Server entry point
```

_Note: The default application is a universal React application with React Router 4 on an Express server. If don't want this setup, have a look at some of the [examples](https://github.com/jaredpalmer/razzle/tree/master/examples). Each one is installable with just a few commands._ 

Once the installation is done, you can run some commands inside the project folder:

### `npm start` or `yarn start` 

Runs the project in development mode.   
You can view your application at `http://localhost:3000`

The page will reload if you make edits.

### `npm run build` or `yarn build`
Builds the app for production to the build folder.      

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### `npm run start:prod` or `yarn start:prod`
Runs the compiled app in production.

You can again view your application at `http://localhost:3000`

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

## Customization

### Extending Babel Config

Razzle comes with most of ES6 stuff you need. However, if you want to add your own babel transformations, just add a `.babelrc` file to the root of your project. 

```json
{
  "presets": [
    "razzle/babel",
    "stage-0"
   ]
}
```

### Extending Webpack

You can also extend the underlying webpack config. Create a file called `razzle.config.js` in your project's root. 

```js
// razzle.config.js

module.exports = {
  modify: (config, {target, dev}, webpack) => {
    // do something to config
  
    return config
  }
}
```

A word of advice: `razzle.config.js` is an escape hatch. However, since it's just JavaScript, you can and should publish your `modify` function to npm to make it reusable across your projects. For example, imagine you added some custom webpack loaders and published it as a package to npm as `my-razzle-modifictions`. You could then write your `razzle.config.js` like so:

```
// razzle.config.js
const modify = require('my-razzle-modifictions');

module.exports = {
  modify
}
```

Last but not least, if you find yourself needing a more customized setup, Razzle is _very_ forkable. There is one webpack configuration factory that is 300 lines of code, and 3 scripts (`build`, `start`, and `init`). The paths setup is shamelessly taken from [create-react-app](https://github.com/facebookincubator/create-react-app), and the rest of the code related to logging.

## `razzle` API Reference

### `razzle start` 

Runs razzle in development mode.   
You can view your application at `http://localhost:3000`

### `razzle build`
Builds a razzle project for production. Final build located in `build` directory.

### `razzle test`

Runs Jest test runner.

### `razzle.config.js`

There are just a few settings you should know about. 

```js
// razzle.config.js

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    // do something and return config
    return config
  }
}
```

### Environment Variables 

**The environment variables are embedded during the build time.** Since Razzle produces a static HTML/CSS/JS bundle and an equivalent static bundle for your server, it cannot possibly read them at runtime. 

- `process.env.RAZZLE_PUBLIC_DIR`: Path to the public directory.
- `process.env.RAZZLE_ASSETS_MANIFEST`: Path to a file containing compiled asset outputs
- `process.env.VERBOSE`: default is false, setting this to true will not clear the console when you make edits in development (useful for debugging).
- `process.env.PORT`: default is `3000`, unless changed
- `process.env.HOST`: default is `0.0.0.0`
- `process.env.NODE_ENV`: `'development'` or `'production'`
- `process.env.BUILD_TARGET`: either `'client'` or `'server'`

You can create your own custom build-time environment variables. They must start
with `RAZZLE_`. Any other variables except the ones listed above will be ignored to avoid accidentally exposing a private key on the machine that could have the same name. Changing any environment variables will require you to restart the development server if it is running.

These environment variables will be defined for you on `process.env`. For example, having an environment variable named `RAZZLE_SECRET_CODE` will be exposed in your JS as `process.env.RAZZLE_SECRET_CODE`.

### Adding Temporary Environment Variables In Your Shell

Defining environment variables can vary between OSes. It’s also important to know that this manner is temporary for the
life of the shell session.

#### Windows (cmd.exe)

```cmd
set RAZZLE_SECRET_CODE=abcdef&&npm start
```

(Note: the lack of whitespace is intentional.)

#### Linux, macOS (Bash)

```bash
RAZZLE_SECRET_CODE=abcdef npm start
```

### Adding Environment Variables In `.env`

To define permanent environment variables, create a file called .env in the root of your project:

```
RAZZLE_SECRET_CODE=abcdef
```

#### What other `.env` files are can be used?

* `.env`: Default.
* `.env.local`: Local overrides. **This file is loaded for all environments except test.**
* `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
* `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

Files on the left have more priority than files on the right:

* `npm start`: `.env.development.local`, `.env.development`, `.env.local`, `.env`
* `npm run build`: `.env.production.local`, `.env.production`, `.env.local`, `.env`
* `npm test`: `.env.test.local`, `.env.test`, `.env` (note `.env.local` is missing)

These variables will act as the defaults if the machine does not explicitly set them.<br>
Please refer to the [dotenv documentation](https://github.com/motdotla/dotenv) for more details.

>Note: If you are defining environment variables for development, your CI and/or hosting platform will most likely need
these defined as well. Consult their documentation how to do this. For example, see the documentation for [Travis CI](https://docs.travis-ci.com/user/environment-variables/) or [Heroku](https://devcenter.heroku.com/articles/config-vars).


## How Razzle works (the secret sauce)

**tl;dr**: 2 configs, 2 ports, 2 webpack instances, both watching and hot reloading the same filesystem, in parallel during development and a little `webpack.output.publicPath` magic.

In development mode (`razzle start`), Razzle bundles both your client and server code using two different webpack instances running with Hot Module Replacement in parallel. While your server is bundled and run on whatever port your specify in `src/index.js` (`3000` is the default), the client bundle (i.e. entry point at `src/client.js`) is served via `webpack-dev-server` on a different port (`3001` by default) with its `publicPath` explicitly set to `localhost:3001` (and not `/` like many other setups do). Then the server's html template just points to the absolute url of the client JS: `localhost:3001/static/js/client.js`. Since both webpack instances watch the same files, whenever you make edits, they hot reload at _exactly_ the same time. Best of all, because they use the same code, the same webpack loaders, and the same babel transformations, you never run into a React checksum mismatch error.

## Inspiration

- [palmerhq/backpack](https://github.com/palmerhq/backpack)
- [nytimes/kyt](https://github.com/nytimes/kyt)
- [facebookincubator/create-react-app](https://github.com/facebookincubator/create-react-app)
- [humblespark/sambell](https://github.com/humblespark/sambell)
- [zeit/next.js](https://github.com/zeit/next.js)


---
#### Author
- [Jared Palmer](https://twitter.com/jaredpalmer)
