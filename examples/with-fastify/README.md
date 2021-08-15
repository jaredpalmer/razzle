# Razzle Fastify Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->Create and start the example:

```bash
npx create-razzle-app --example with-fastify with-fastify

cd with-fastify
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example

This is an example of how to use Razzle with [Fastify](https://www.fastify.io/) and includes [TypeScript](https://github.com/Microsoft/TypeScript).

It is a very similar implementation to `with-koa` but with help from that example itself (found [here](https://github.com/jaredpalmer/razzle/blob/master/examples/with-koa/src/index.js)) and from the Fastify docs for serverless application [Serverless](https://www.fastify.io/docs/latest/Serverless/#should-you-use-fastify-in-a-serverless-platform#Vercel).

### TypeScript

Basic razzle will uses Babel to transform TypeScript to plain JavaScript ( with babel-loader ), and uses TypeScript for type-checking.

Razzle knows how to resolve `.ts` and `.tsx` files out of the box.
