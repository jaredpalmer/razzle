# Razzle With Webpack Dev Server v4 Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->Create and start the example:

```bash
npx create-razzle-app --example with-webpack-dev-server-v4 with-webpack-dev-server-v4

cd with-webpack-dev-server-v4
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->


## Idea behind the example
This is an example of how to use razzle with the `webpack-dev-server` version 4.
It updates the `webpack-dev-server` in `package.json` to the current latest version 4.
It provides a custom `razzle.config.js` that throws if the `webpack-dev-server` < version 4 to ensure the example setup is correct.
