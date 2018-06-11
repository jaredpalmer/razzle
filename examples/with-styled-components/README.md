# Razzle Basic Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/basic
cd basic
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example

This is a basic, bare-bones example that shows a very minimal implementation
of [StyledComponents](https://github.com/styled-components/styled-components).
It satisfies the entry points `src/index.js` for the server and`src/client.js`
for the browser.
There are comments in `src/server.js` to show how the styles are gathered and
rendered into to the DOM
