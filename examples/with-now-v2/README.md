# Razzle Now v2 Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->Create and start the example:

```bash
npx create-razzle-app --example with-now-v2 with-now-v2

cd with-now-v2
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

Install now:

```
npm i -g now
```

Build and deploy:

```bash
yarn build
now
```

Open the link written in the console.

## Idea behind the example

Take a look at `now.json`. We are uploading the result of the razzle build, and setting up the routes for the app entry point and all static resources.

```json
{
    "version": 2,
    "name": "example",
    "builds": [
        {
            "src": "build/public/**",
            "use": "@now/static"
        },
        {
            "src": "build/server.js",
            "use": "@now/node-server"
        }
    ],
    "routes": [
        { "src": "/assets.json", "dest": "build/assets.json" },
        { "src": "/favicon.ico", "dest": "build/public/favicon.ico" },
        { "src": "/robots.txt", "dest": "build/public/robots.txt" },
        { "src": "/static/(.*)", "dest": "build/public/static/$1" },
        { "src": "/(.*)", "dest": "build/server.js" }

    ],
    "env": {
      "NODE_ENV": "production"
    }
}
```

We are also setting the `NODE_ENV` environment variable. Most likely, your app will use other environment variables, beware you should not commit secrets like api keys and others into your repository. Take a look at now's documentation to understand what you should do in such cases.

## Documentation

* [Zeit Now v2 Documentation](https://zeit.co/docs/v2/)
  * [@now/node-server](https://zeit.co/docs/v2/deployments/official-builders/node-js-server-now-node-server/)
  * [Environment Variables and Secrets](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets/)
