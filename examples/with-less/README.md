# Razzle With LESS Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-less
cd with-less
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example

This is a basic, bare-bones example of how to use razzle. It satisfies the entry points and use less as styling language
You can import anything from node_modules or other less files, like Ant Design, etc.
`src/index.js` for the server, `src/client.js` for the browser, and `src/App.less` for LESS style.
