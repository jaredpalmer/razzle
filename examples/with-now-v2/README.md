# Razzle Now v2 Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the development documentation for this example

Clone the `razzle` repository:

```bash
git clone https://github.com/jaredpalmer/razzle.git

cd razzle
yarn install --frozen-lockfile --ignore-engines --network-timeout 30000
```

Create and start the example:

```bash
node -e 'require("./test/fixtures/util").setupStageWithExample("with-now-v2", "with-now-v2", symlink=false, yarnlink=true, install=true, test=false);'

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

We are also setting the `NODE_ENV` environment variable. Most likely, your app will use other environment variables, beware you should not commit secrets like api keys and others into your repository. Take a look at now's documentation to understand what you should do in such cases.

## Documentation

* [Zeit Now v2 Documentation](https://zeit.co/docs/v2/)
  * [@now/node-server](https://zeit.co/docs/v2/deployments/official-builders/node-js-server-now-node-server/)
  * [Environment Variables and Secrets](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets/)
