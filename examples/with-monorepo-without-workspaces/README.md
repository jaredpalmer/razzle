# Razzle Monorepo without workspaces Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the canary release documentation for this example

Create and start the example:

```bash
npx create-razzle-app@canary --example with-monorepo-without-workspaces with-monorepo-without-workspaces

cd with-monorepo-without-workspaces
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->


## Idea behind the example

This is similar to the monorepo example, but adapted for the case where you want
to build multiple separate applications that share the same dependencies (and
therefore share the same package.json in the root).