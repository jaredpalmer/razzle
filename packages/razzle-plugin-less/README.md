# razzle-plugin-less

A razzle plugin for loading [LESS](http://lesscss.org/) with custom config.

## Usage in Razzle Projects

```bash
yarn add razzle-plugin-less --dev
```

### With the default options

```js
// razzle.config.js

module.exports = {
  plugins: ['less'],
};
```

---

### With custom options

See [less options](http://lesscss.org/usage/#less-options) to override less configs.

See [style loader options](https://github.com/webpack-contrib/style-loader#options) to override style configs.

See [css loader options](https://github.com/webpack-contrib/css-loader#options) to override css configs.

```js
// razzle.config.js

module.exports = {
  plugins: [
    {
      name: 'less',
      options: {
          style: {
                // style options for dev
                // in production thi plugin uses mini-css-extract-plugin
                // MiniCssExtractPlugin.loader
            }
        css: {
            dev: {
                // css options for dev 
            },  
            prod: {
                // css options for dev 
            }
        }
        less: {
            dev: {
                // less options for dev 
            },  
            prod: {
                // less options for dev
            }
        },
      },
    }
  ],
};
```