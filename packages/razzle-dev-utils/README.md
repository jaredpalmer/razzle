# razzle-dev-utils

This package includes some utilties used by [Razzle](https://github/com/palmerhq/razzle)

## Usage in Razzle Projects

These utilities come by default with Razzle, which includes it by default. **You don’t need to install it separately in Razzle projects.**

## Usage Outside of Razzle

If you don’t use Razzle, you may keep using these utilities. Their development will be aligned with Razzle, so major versions of these utilities may come out relatively often. Feel free to fork or copy and paste them into your projects if you’d like to have more control over them, or feel free to use the old versions.

### Entry Points

There is no single entry point. You can only import individual top-level modules.

#### `logger`

- `logger.log(thing: any): void`: Log to console. = `console.log`
- `logger.start(text: string): void`: Log the start of a task to console
- `logger.done(text: string): void`: Log the end of task to console
- `logger.info(text: string, data: object): void`: Log information and data to console
- `logger.debug(text: string, data: object): void`: Log debug message and data to console
- `logger.warn(text: string, data: object): void`: Log a warning with message and data to console
- `logger.error(text: string, err: object): void`: Log a message and an error to console

#### `new FriendlyErrorsWebpackPlugin({ verbose: boolean, onSuccessMessage: string, target: 'web' | 'server' })`

This will pretty print webpack errors to your console. It is mean to be used with Razzle's double webpack setup, where you have two webpack instances running in parallel. Otherwise the output looks almost identical to `create-react-app's` as it uses the same error formatter under the hood.

```js
const FriendlyErrorsPlugin = require('razzle-dev-utils/FriendlyErrorsPlugin');

module.exports = {
  // ...
  plugins: [
    new FriendlyErrorsPlugin({
        verbose: false,
        target: 'web',
        onSuccessMessage: `Your application is running at http://${process.env.HOST}:${process.env.PORT}`,
      }),
    // ...
  ],
  // ...
}
```

#### `printErrors(summary: string, errors: Error[])`

Pretty print an array of errors with a message. Good for CI's.

```js
const printErrors = require('razzle-dev-utils/printErrors');

try {
  // do something
} catch (e) {
  printErrors('Failed to compile.', [e]);
}
```

`makeLoaderFinder(loaderName: string): (rule: WebPackRule) => boolean;`

Helper function to find a loader in the webpack config object. Used for writing Razzle Plugins, or razzle modify functions.

Example:

```js
// razzle.config.js
const loaderFinder = require('razzle-dev-utils/makeLoaderFinder');

module.exports = {
  modify(config) {
    // Makes a finder function, to search for babel-loader
    const babelLoaderFinder = makeLoaderFinder('babel-loader');

    // Finds the JS rule containing babel-loader using our function
    const jsRule = config.module.rules.find(babelLoaderFinder);

    // Set cacheDirectory to true in our babel-loader
    jsRule.use.find(babelLoaderFinder).options.cacheDirectory = true;
  },
};
```
