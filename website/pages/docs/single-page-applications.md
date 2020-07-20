# Single Page Applications

In addition to universal/isomorphic appplications, Razzle can build single page (or client-only) applications. To do this, you can remove `index.js` and `server.js` then `index.html` file inside public folder at the end pass `--type=spa` to your `package.json`'s scripts like so:

```diff
"scripts": {
-  "start": "razzle start",
+  "start": "razzle start --type=spa",
-  "build": "razzle build",
+  "build": "razzle build --type=spa",
  "test": "razzle test --env=jsdom",
-  "start:prod": "NODE_ENV=production node build/server.js"
+  "start:prod": "serve -s build/public"
}
```

This effectively turns Razzle into [create-react-app](https://create-react-app.dev).
