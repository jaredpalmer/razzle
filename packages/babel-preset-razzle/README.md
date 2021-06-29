# babel-preset-razzle

This package includes the [Babel](https://babeljs.io) preset used by [Razzle](https://github/com/palmerhq/razzle)

## Usage in Razzle Projects

The easiest way to use this configuration is with Razzle, which includes it by default.

## Usage Outside of Razzle

If you want to use this Babel preset in a project not built with razzle, you can install it with following steps.

First, [install Babel](https://babeljs.io/docs/setup/).

Then create a file named `.babelrc` with following contents in the root folder of your project:

```js
{
  "presets": ["razzle"]
}
```

This preset uses the `useBuiltIns` option with [transform-object-rest-spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/), which assumes that `Object.assign` is available or polyfilled.
