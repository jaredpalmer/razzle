# Razzle Elm Example

## How to use
Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-elm
cd with-elm
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example
This is a basic example of how to use Razzle and Elm, it uses:

- [elm-static-html](https://github.com/eeue56/elm-static-html-lib) to convert Elm views into raw html
- [elm-webpack-loader](https://github.com/elm-community/elm-webpack-loader) load elm files and import them into javascript
- [elm-hot-loader](https://github.com/fluxxu/elm-hot-loader) hot reload all Elm files while dev

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
