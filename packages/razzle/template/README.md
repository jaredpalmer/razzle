![razzle](https://cloud.githubusercontent.com/assets/4060187/24077825/4ef23636-0c30-11e7-807d-62b91db7aa7e.png)

# Razzle ✨

A zero-config, razzle-dazzle build system for universal React applications.

## Features

 - 🌎 **Universal Hotness** Both the client and server use hot module replacement.
 - ⚛️ **Babel / Webpack Goodness**
 - 🚫 **Zero-Config*ness*?**

## Quick Overview

```bash
yarn add --global razzle

razzle new myApp
cd myApp
yarn start
```

## 25 seconds to bootstrap

<img src="https://cloud.githubusercontent.com/assets/4060187/24125880/4ee84780-0da1-11e7-83fe-c74515494c75.gif" width="500px" alt="Razzle Onboarding"/>


## Customization

### Extending Babel Config

Razzle comes with most of ES6 stuff you need. However, if you want to add your own babel transformations, just add a `.babelrc` file to the root of your project. 

```json
{
  "presets": [
    "razzle/babel",
    "stage-0"
   ]
}
```

### Extending Webpack

You can also extend the underlying webpack config. Create a file called `razzle.config.js` in your project's root. 

```js
// razzle.config.js

module.exports = {
  modify: (config, {dev}, webpack) => {
    // do something to config
  
    return config
  }
}
```

### Webpack Flags

- `process.env.RAZZLE_PUBLIC_DIR`: Path to the public directory.
- `process.env.RAZZLE_ASSETS_MANIFEST`: Path to a file containing compiled asset outputs
- `process.env.PORT`: default is `3000`, unless changed
- `process.env.NODE_ENV`: `'development'` or `'production'`
- `process.env.BUILD_TARGET`: either `'client'` or `'server'`


## Razzle API Reference

### `razzle init <project>` 
This will create a new razzle project (with the global CLI) installed. It will also install dependencies.

### `razzle start` 

This run the project in development mode.   
You can view your application at `http://localhost:3000`

### `razzle build`
Builds project for production. Final build located in `build` directory.   
You can run your app by simply running:   

```
node build/server.js
```

or  

```
yarn run start:prod
```

### `razzle.config.js`

There are just a few settings you should know about. 

```js
// razzle.config.js

module.exports = {
  port: 3000, // Changes default port setting
  modify: (config, { dev }, webpack) => {
    // do something and return config
  
    return config
  }
}
```


### Inspiration

- [palmerhq/backpack](https://github.com/palmerhq/backpack)
- [nytimes/kyt](https://github.com/nytimes/kyt)
- [facebookincubator/create-react-app](https://github.com/facebookincubator/create-react-app)
- [humblespark/sambell](https://github.com/humblespark/sambell)
- [zeit/next.js](https://github.com/zeit/next.js)


---
#### Author
- [Jared Palmer](https://twitter.com/jaredpalmer)
