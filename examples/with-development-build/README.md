# Razzle Basic Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the canary release documentation for this example

Create and start the example:

```bash
npx create-razzle-app@canary --example basic basic

cd basic
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->


## Idea behind the example
This is a basic, bare-bones example of how to use razzle to produce a development build. It satisfies the entry points
`src/index.js` for the server and and `src/client.js` for the browser.

The only difference between this example and the `basic` example is that the `razzle build` command is replaced with `razzle build --node-env=development`.

You can use this command separately in a new command inside the `scripts` section of the project's `package.json` file, if you find it useful.
