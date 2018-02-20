# Razzle Reason React

## How to use

First install the Reason toolchain ([reason-cli](https://github.com/reasonml/reason-cli)) globally

```bash
npm install -g https://github.com/reasonml/reason-cli/archive/beta-v-1.13.6-bin-darwin.tar.gz
```

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-reason-react
cd with-reason-react
```

Install it and run:

```bash
yarn install
yarn start
```

#### NOTE: This example takes a while to install. Stick with it.

Now you can go and edit `src/App.re`. When you make changes, your **browser and server** will Hot Reload.

## Idea behind the example

This is an example of how to use [Reason React](https://github.com/reasonml/reason-react) and Razzle together. Yes, you read that correctly. SSR, Reason, React, HMR.

## Secret sauce

This example works by running BuckleScript Platform to compile Reason-React files (`.re`) and then importing that output back into the vanilla Razzle app using the JS-Reason-React interop.

Since Reason compiles to (beautifully written) JS, we don't have to do anything else to get universal HMR going because Razzle already does that. We just need to import `<App />` a litte bit differently in `src/server.js` and `src/client.js`.

```reason
/* /src/App.re */
type state = {count: int};

type action =
  | Increment
  | Decrement;

let component = ReasonReact.reducerComponent "App";

/* underscore before names indicate unused variables. We name them for clarity */
let make ::title _children => {
  ...component,
  initialState: fun () => {count: 0},
  reducer: fun action state =>
    switch action {
    | Increment => ReasonReact.Update {...state, count: state.count + 1}
    | Decrement => ReasonReact.Update {...state, count: state.count - 1}
    },
  render: fun self => {
    let message = "Count: " ^ string_of_int self.state.count;
    <div className="App">
      <div className="App-header">
        <div style=(ReactDOMRe.Style.make backgroundColor::"#db4d3f" cursor::"pointer" ())>
          <svg className="App-logo" viewBox="0 0 841.9 595.3" alt="logo">
            <g fill="#fff">
              <path
                d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"
              />
              <circle cx="420.9" cy="296.5" r="45.7" />
              <path d="M520.5 78.1z" />
            </g>
          </svg>
        </div>
        <h2 style=(ReactDOMRe.Style.make marginLeft::"30px" fontSize::"2em" ())>
          (ReasonReact.stringToElement title)
        </h2>
      </div>
      <p className="App-intro">
        <code> (ReasonReact.stringToElement "src/App.re") </code>
        (
          ReasonReact.stringToElement ". When you make edits, both the server and broswer will hot reload."
        )
      </p>
      <div className="App-intro">
        (ReasonReact.stringToElement message)
        <button onClick=(self.reduce (fun _event => Increment))>
          (ReasonReact.stringToElement "+")
        </button>
        <button onClick=(self.reduce (fun _event => Decrement))>
          (ReasonReact.stringToElement "-")
        </button>
      </div>
    </div>
  }
};

let comp =
  ReasonReact.wrapReasonForJs ::component (fun jsProps => make title::jsProps##title [||]);
```

```js
// src/client.js

// We need to point this to our Reason-React output
const App = require('../lib/js/src/app').comp;

import './client.css';

import React from 'react';
import { render } from 'react-dom';

// No JSX required, it's already in JS.
render(
  React.createElement(App, {
    title: 'Welcome to Razzle Reason React!',
  }),
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
```

```js
// src/server.js
// We need to point this to our Reason-React output, just like above
const App = require('../lib/js/src/app').comp;

import React from 'react';
import express from 'express';
import path from 'path';
import { renderToString } from 'react-dom/server';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    // Again, no JSX needed
    const markup = renderToString(
      React.createElement(App, {
        title: 'Welcome to Razzle Reason React',
      })
    );
    res.send(
      `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle Reason React</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
        <script src="${assets.client.js}" defer></script>
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
    );
  });

export default server;
```
