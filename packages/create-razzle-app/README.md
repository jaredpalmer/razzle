# Create Razzle App

## Create UNIVERSAL React, Preact, and Inferno apps in one command.

```
npx create-razzle-app my-proj
cd my-proj
npm start
```

or.... with the `yarn create` command:

```
yarn create razzle-app my-proj
cd my-proj
yarn start
```

## You can also initialize a project from one of the [official examples](https://github.com/jaredpalmer/razzle/tree/master/examples).

```
npx create-razzle-app --example with-preact my-preact-app
cd my-preact-app
npm start
```

or

```
yarn create razzle-app --example with-preact my-preact-app
cd my-preact-app
```

### or initialize a project from npm/github/git/file examples.

From npm:

```
npx create-razzle-app --example razzle-example-basic@latest my-app
cd my-app
npm start
```

From github repo:

```
npx create-razzle-app --example https://github.com/fivethreeo/razzle-example-basic@master my-app
cd my-app
npm start
```

From git repo:

```
npx create-razzle-app --example git+git://github.com/fivethreeo/razzle-example-basic@master my-app
cd my-app
npm start
```

From local path:

```
npx create-razzle-app --example file:local/path/to/example my-app
cd my-app
npm start
```

All methods except official and file examples also supports examples at subpaths:

```
npx create-razzle-app --example git+git://github.com/fivethreeo/razzle-example-basic@master:subexample my-app
cd my-app
npm start
```

```
npx create-razzle-app --example razzle-example-basic@latest:subexample my-app
cd my-app
npm start
```
