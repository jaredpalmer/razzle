# [Single Page Applications](https://github.com/jaredpalmer/razzle/blob/master/examples/basic-spa/)

In addition to universal/isomorphic applications, Razzle can build single page (or client-only) applications. To do this, remove `index.js` and `server.js` from the src folder, and create an `index.html` file inside the public folder with the following template:

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="<%= process.env.PUBLIC_PATH %>favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="theme-color" content="#000000" />
  <%= htmlWebpackPlugin.tags.headTags %>
  <!--
      Notice the use of <%= process.env.PUBLIC_PATH %> in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.
      Unlike "/favicon.ico" or "favicon.ico", "<%= process.env.PUBLIC_PATH %>/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
  <title>React App</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.
      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.
      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
    <%= htmlWebpackPlugin.tags.bodyTags %>
</body>
</html>
```

Finally, pass `buildType` to your `razzle.config.js` options like so:

```js
'use strict';

module.exports = {
  options: {
    buildType: 'spa',
  }
};
```

This effectively turns Razzle into [create-react-app](https://create-react-app.dev).
