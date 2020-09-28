# Razzle Polka Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->Create and start the example:

```bash
npx create-razzle-app --example with-polka with-polka

cd with-polka
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example

An example of how to use a custom, express middleware-compatible server like [polka](https://github.com/lukeed/polka) with razzle. It satisfies the entry points
`src/index.js` for the server and and `src/client.js` for the browser. HMR works for server-side changes too by creating new instances of the polka server handler.
