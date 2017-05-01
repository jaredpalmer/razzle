# Razzle ✨

Create universal [React](https://github.com/facebook/react), [Preact](https://github.com/developit/preact), [Inferno](https://github.com/infernojs), and [Rax](https://github.com/alibaba/rax) applications with no build configuration.

## Motivation

Universal JavaScript applications are tough to setup. Either you buy into a framework like [Next.js](https://github.com/zeit/next.js) or [react-server](https://github.com/redfin/react-server), fork a boilerplate, or go set things up yourself. Razzle aims to fill this void by abstracting all the required tooling for your universal JavaScript application into a single dependency, and then leaving the rest of the architectural decisions about frameworks, routing, and data fetching up to you.

## Features

Razzle comes with the "battery-pack included" and is part of a complete JavaScript breakfast:

- Hot reloads the client and server code whenever you make edits
- Comes with your favorite ES6 JavaScript goodies (through `babel-preset-razzle`)
- Comes with the same CSS setup as [create-react-app](https://github.com/facebookincubator/create-react-app) 
- Works with [React](https://github.com/facebook/react), [Preact](https://github.com/developit/preact), [Inferno](https://github.com/infernojs), and [Rax](https://github.com/alibaba/rax) as well as [Angular](https://github.com/angular/angular) and [Vue](https://github.com/vuejs/vue) if that's your thing
- Customization escape hatches through `.babelrc` and `razzle.config.js`

## Quick Start

```bash
$ npm i -g razzle

razzle init my-app
cd my-app/
npm start
```

Then open http://localhost:3000/ to see your app.

<img src="https://cloud.githubusercontent.com/assets/4060187/24125880/4ee84780-0da1-11e7-83fe-c74515494c75.gif" width="500px" alt="Razzle Onboarding"/>

When you’re ready to deploy to production, create a minified bundle with `npm run build`.


## Get Started Immediately

You don’t need to install or configure tools like Webpack or Babel.
They are preconfigured and hidden so that you can focus on the code.

Just create a project, and you’re good to go.


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
    client.js            # Client-side code entry point 
    Home.css
    Home.js 
    server.js .          # Server code (An express application)
    react.svg
    index.js             # Server entry point
```

Note: While the default application is a universal React application with React Router 4 on an Express server. If don't want this setup, take a look at [any of the examples](https://github.com/jaredpalmer/razzle/tree/master/examples). Each one is installable with just a few commands. 

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

You can view your application at `http://localhost:3000`


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

A word of advice: `razzle.config.js` is an escape hatch. However, since it's just JavaScript, you can and should publish your modify function to npm to make it reusable across your projects. For example, imagine you added some customizations and published it to npm as `my-razzle-modifictions`. You could then write your `razzle.config.js` like so:

```
// razzle.config.js
const modify = require('my-razzle-modifictions');

module.exports = {
  modify
}
```

Last but not least, if you find yourself needing a more customized setup, Razzle is _very_ forkable. There is one webpack configuration factory that is 300 loc, and three scripts (`build`, `start`, and `init`). The paths setup is shamelessly taken from [create-react-app](https://github.com/facebookincubator/create-react-app), and the rest of the code related to logging.

## Razzle API Reference

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
  port: 3000, // Changes default port setting
  host: '0.0.0.0', // Changes default host, useful for testing on mobile
  clearConsole: false, // Show verbose output, will not clear console on changes.
  modify: (config, { target, dev }, webpack) => {
    // do something and return config
    return config
  }
}
```

### Webpack Flags (available at runtime)

- `process.env.RAZZLE_PUBLIC_DIR`: Path to the public directory.
- `process.env.RAZZLE_ASSETS_MANIFEST`: Path to a file containing compiled asset outputs
- `process.env.PORT`: default is `3000`, unless changed
- `process.env.NODE_ENV`: `'development'` or `'production'`
- `process.env.BUILD_TARGET`: either `'client'` or `'server'`

## Backstory

I have been building a massive React application for ~10 months. I started it with Next.js, but got frustrated with lack of SCSS support and some bugs related to routing. Additionally, I love the developer experience of Next, but do not like the way it fully blocks render between page transitions. After some research, I moved the application over to the The New York Times' [kyt](https://github.com/nytimes/kyt) project, which is very similar to Razzle (more on that later). This was great for a few months. However, as the application grew `kyt`, started to slow down to a crawl. It would take ~45 seconds just to run `kyt dev`. Being the impatient millenial that I am, I set out to build my own `kyt` but with some DX improvements. 

## How Razzle works (the secret sauce)

**"Double Webpack"**: 2 configs, 2 webpack instances, both watching and hot reloading the same filesystem, in parallel.

In development mode (`razzle start`), Razzle bundles both your client and server code using two different webpack instances running with Hot Module Replacement in parallel. While your server is bundled and run on whatever port your specify in `src/index.js` (`3000` is the default), the client bundle (i.e. entry point at `src/client.js`) is served via `webpack-dev-server` on a different port (`3001`) with its `publicPath` set to `localhost:3001/static/js/client.js`. Then your server's html template just loads the client JS from `localhost:3001/static/js/client.js` and not from `/static/js/client.js`. Since both webpack instances watch the same files, whenever you make a change and press save, they hot reload at _exactly_ the same time. Best of all, because they use the same code, the same webpack loaders, and the same babel transformations, you never run into a React checksum mismatch error.

## Inspiration

- [palmerhq/backpack](https://github.com/palmerhq/backpack)
- [nytimes/kyt](https://github.com/nytimes/kyt)
- [facebookincubator/create-react-app](https://github.com/facebookincubator/create-react-app)
- [humblespark/sambell](https://github.com/humblespark/sambell)
- [zeit/next.js](https://github.com/zeit/next.js)


---
#### Author
- [Jared Palmer](https://twitter.com/jaredpalmer)
