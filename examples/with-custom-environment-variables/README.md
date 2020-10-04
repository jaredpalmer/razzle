# Razzle Custom Environment Variables Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the finch release documentation for this example

Create and start the example:

```bash
npx create-razzle-app@finch --example with-custom-environment-variables with-custom-environment-variables

cd with-custom-environment-variables
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This example shows how you can use `.env` files to set environment-specific
**build-time** variables.

> Note: Razzle's `.env` setup is alsmost identically to [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables).

```bash
# .env
HOST=10.69.107.189  # HOST sets the host IP address
PORT=4000 # Serve on :4000
VERBOSE=true # Show verbose logging output (will not clear console between compiles)

RAZZLE_MY_CUSTOM_VARIABLE=XXXXXX  # Will be available on server and client as process.env.RAZZLE_MY_CUSTOM_VARIABLE
```
