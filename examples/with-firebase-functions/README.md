# Razzle with Cloud Functions for Firebase example

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
node -e 'require("./test/fixtures/util").setupStageWithExample("with-firebase-functions", "with-firebase-functions", symlink=false, yarnlink=true, install=true, test=false);'

cd with-firebase-functions
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->


Build client and server

```bash
yarn build
```

Deploy to firebase

```bash
yarn deploy
```

Access your app at `<firebase-project-id>.firebaseapp.com`

## Idea behind the example
This is a basic example of how to use razzle with firebase functions and firebase hosting.
