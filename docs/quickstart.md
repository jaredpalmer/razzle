---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
---

![repo-banner](https://user-images.githubusercontent.com/4060187/28923990-050a32d4-782e-11e7-9da7-574ce5a8b455.png)

[![CircleCI](https://circleci.com/gh/jaredpalmer/razzle/tree/master.svg?style=shield)](https://circleci.com/gh/jaredpalmer/razzle/tree/master) ![Razzle-status](https://david-dm.org/jaredpalmer/razzle.svg?path=packages/razzle) [![npm version](https://badge.fury.io/js/razzle.svg)](https://badge.fury.io/js/razzle) [![Known Vulnerabilities](https://snyk.io/test/npm/razzle/badge.svg)](https://snyk.io/test/npm/razzle) [![Greenkeeper badge](https://badges.greenkeeper.io/jaredpalmer/razzle.svg)](https://greenkeeper.io/) [![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/palmer)

Universal JavaScript applications are tough to setup. Either you buy into a framework like [Next.js](https://github.com/zeit/next.js) or [react-server](https://github.com/redfin/react-server), fork a boilerplate, or set things up yourself. Aiming to fill this void, Razzle is a tool that abstracts all complex configuration needed for SSR into a single dependency--giving you the awesome developer experience of [create-react-app](https://github.com/facebookincubator/create-react-app), but then leaving the rest of your app's architectural decisions about frameworks, routing, and data fetching up to you. With this approach, Razzle not only works with React, but also Reason, Elm, Vue, Angular, and most importantly......whatever comes next.

**Razzle comes with the "battery-pack included"**:

- :fire: Universal Hot Module Replacement, so both the client and server update whenever you make edits. No annoying restarts necessary
- Comes with your favorite ES6 JavaScript goodies (through `babel-preset-razzle`)
- Comes with the same CSS setup as [create-react-app](https://github.com/facebookincubator/create-react-app)
- Works with [React](https://github.com/facebook/react), [Preact](https://github.com/developit/preact), [Elm](http://elm-lang.org/), [Reason-React](https://github.com/jaredpalmer/razzle/tree/master/examples/with-reason-react), [Inferno](https://github.com/infernojs), and [Rax](https://github.com/alibaba/rax) as well as [Angular](https://github.com/angular/angular) and [Vue](https://github.com/vuejs/vue) if that's your thing
- Escape hatches for customization via `.babelrc` and `razzle.config.js`
- [Jest](https://github.com/facebook/jest) test runner setup with sensible defaults via `razzle test`
- :rocket: SPA mode, build client side apps with razzle

# Quick Start

```bash
npx create-razzle-app my-app
cd my-app
npm start
```

Then open http://localhost:3000/ to see your app. Your console should look like this:

<img src="https://cloud.githubusercontent.com/assets/4060187/26324663/b31788c4-3f01-11e7-8e6f-ffa48533af54.png" width="500px" alt="Razzle Development Mode"/>

**That's it**. You don't need to worry about setting up multiple webpack configs or other build tools. Just start editing `src/App.js` and go!

Below is a list of commands you will probably find useful.

## `npm start` or `yarn start`

Runs the project in development mode.  
You can view your application at `http://localhost:3000`

The page will reload if you make edits.

## `npm run build` or `yarn build`

Builds the app for production to the build folder.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## `npm run start:prod` or `yarn start:prod`

Runs the compiled app in production.

You can again view your application at `http://localhost:3000`

## `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

## `npm start -- --inspect=[host:port]` or `yarn start -- --inspect=[host:port]`

To debug the node server, you can use `razzle start --inspect`. This will start the node server and enable the inspector agent. The `=[host:port]` is optional and defaults to `=127.0.0.1:9229`. For more information, see [this](https://nodejs.org/en/docs/guides/debugging-getting-started/).

## `npm start -- --inspect-brk=[host:port]` or `yarn start -- --inspect-brk=[host:port]`

This is the same as --inspect, but will also break before user code starts. (to give a debugger time to attach before early code runs) For more information, see [this](https://nodejs.org/en/docs/guides/debugging-getting-started/).

## `rs`

If your application is running, and you need to manually restart your server, you do not need to completely kill and rebundle your application. Instead you can just type `rs` and press enter in terminal.

## <img src="https://user-images.githubusercontent.com/4060187/37915268-209644d0-30e7-11e8-8ef7-086b529ede8c.png" width="500px" alt="Razzle Hot Restart"/>
