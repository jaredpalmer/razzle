# Razzle Elm Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the finch release documentation for this example

Create and start the example:

```bash
npx create-razzle-app@finch --example with-elm with-elm

cd with-elm
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example

This is a basic example of how to use Razzle and Elm, it uses:

* [elm-static-html](https://github.com/eeue56/elm-static-html-lib) to convert Elm views into raw html
* [elm-webpack-loader](https://github.com/elm-community/elm-webpack-loader) load elm files and import them into javascript
* [elm-hot-loader](https://github.com/fluxxu/elm-hot-loader) hot reload all Elm files while dev

`src/client.js` contains all the js code required to load Elm, you can configure Elm ports here
`src/server.js` the server side, here call `elm-static-html-lib` with the respective module to render the view

---

If you want to activate the Elm debug mode or other tooling and debug utilites of Elm edit `razzle.config.js`:

```js
{
    loader: 'elm-webpack-loader',
    options: { //Edit here
        verbose: true,
        warn: true,
        pathToMake: require('elm/platform').executablePaths['elm-make'],
        forceWatch: true
    }
}
```

As of Razzle 2.0, you can now use [razzle-plugin-elm](../../packages/razzle-plugin-elm/README.md) instead of adding the webpack loaders on your own.
