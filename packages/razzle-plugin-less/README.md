# razzle-plugin-less


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

```js
// razzle.config.js

module.exports = {
  plugins: [
    {
      name: 'less',
      options: {
        less: {
          dev: {
                strictMath: true,
                noIeCompat: true,
            },  
        },
      },
    }
  ],
};
```
