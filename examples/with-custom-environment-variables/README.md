# Razzle Custom Environment Variables Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-custom-environment-variables
cd with-custom-environment-variables
```

Install it and run:

```bash
yarn install
yarn start
```

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
