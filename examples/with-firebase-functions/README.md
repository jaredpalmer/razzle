# Razzle with Cloud Functions for Firebase example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-firebase-functions
cd with-firebase-functions
```

Setting up firebase:

* install Firebase Tools: `npm i -g firebase-tools`
* create a project at [Firebase console](https://console.firebase.google.com/)
* replace <firebase-project-id> in `.firebaserc` with the actual project ID

Install it and run:

```bash
yarn install
yarn start
```

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
