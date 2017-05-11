# Razzle ✨

Create universal [React](https://github.com/facebook/react), [Preact](https://github.com/developit/preact), [Inferno](https://github.com/infernojs), and [Rax](https://github.com/alibaba/rax) applications with no build configuration.

## Motivation

Universal JavaScript applications are tough to setup. Either you buy into a framework like [Next.js](https://github.com/zeit/next.js) or [react-server](https://github.com/redfin/react-server), fork a boilerplate, or set things up yourself. Razzle aims to fill this void by abstracting all the required tooling for your universal JavaScript application into a single dependency, and then leaving the rest of the architectural decisions about frameworks, routing, and data fetching up to you.

## Features

Razzle comes with the "battery-pack included" and is part of a complete JavaScript breakfast:

- Hot reloads client and server code when you make edits. No restarts necessary
- Comes with your favorite ES6 JavaScript goodies (through `babel-preset-razzle`)
- Comes with the same CSS setup as [create-react-app](https://github.com/facebookincubator/create-react-app) 
- Works with [React](https://github.com/facebook/react), [Preact](https://github.com/developit/preact), [Inferno](https://github.com/infernojs), and [Rax](https://github.com/alibaba/rax) as well as [Angular](https://github.com/angular/angular) and [Vue](https://github.com/vuejs/vue) if that's your thing
- Escape hatches for customization via `.babelrc` and `razzle.config.js`

## Quick Start

```bash
$ npm i -g razzle

razzle init my-app
cd my-app
npm start
```

Then open http://localhost:3000/ to see your app.

<img src="https://cloud.githubusercontent.com/assets/4060187/24125880/4ee84780-0da1-11e7-83fe-c74515494c75.gif" width="500px" alt="Razzle Onboarding"/>

When you’re ready to deploy to production, create a minified bundle with `npm run build`.


## Getting Started

### Installation

Install Razzle globally:

```
npm i -g razzle
```

or if you have `yarn` installed:

```
yarn global add razzle
```


### Creating an app

To create an app, run:

```
razzle init my-app
cd my-app
```

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

### `razzle init <project>` 
This will create a new razzle project (with the global CLI) installed. It will also install dependencies.

### `razzle start` 

Runs razzle in development mode.   
You can view your application at `http://localhost:3000`

### `razzle build`
Builds a razzle project for production. Final build located in `build` directory.

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
- `process.env.VERBOSE: default is false, setting this to true will not clear the console when you make edits in development (useful for debugging).
- `process.env.PORT`: default is `3000`, unless changed
- `process.env.HOST`: default is `0.0.0.0`
- `process.env.NODE_ENV`: `'development'` or `'production'`
- `process.env.BUILD_TARGET`: either `'client'` or `'server'`

You can create your own custom build-time environment variables. They must start
with `RAZZLE_`. Any other variables except the ones listed above will be ignored to avoid accidentally exposing a private key on the machine that could have the same name. Changing any environment variables will require you to restart the development server if it is running.

These environment variables will be defined for you on `process.env`. For example, having an environment variable named `RAZZLE_SECRET_CODE` will be exposed in your JS as `process.env.RAZZLE_SECRET_CODE`.

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
