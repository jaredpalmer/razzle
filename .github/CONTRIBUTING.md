
# Contributing to Razzle

Hi there! Thanks for your interest in Razzle. This guide will help you get started contributing.

<!-- INSERT doctoc generated TOC please keep comment here to allow auto update -->
<!-- START doctoc generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn build-docs TO UPDATE -->
- [Contributing to Razzle](#contributing-to-razzle)
  - [Developing locally](#developing-locally)
- [optionally install add-dependencies](#optionally-install-add-dependencies)
    - [Commands](#commands)
    - [Workflow for working on razzle core with examples](#workflow-for-working-on-razzle-core-with-examples)
- [or](#or)
- [git checkout -b my-feature-branch master](#git-checkout--b-my-feature-branch-master)
- [git checkout -b my-feature-branch three](#git-checkout--b-my-feature-branch-three)
- [/home/oyvind/Documents/GitHub/razzle/](#homeoyvinddocumentsgithubrazzle)
- [to make sure tests pass](#to-make-sure-tests-pass)
- [to add a new example](#to-add-a-new-example)
- [to work on a example](#to-work-on-a-example)
- [if it is a example with webpack5 you need to do](#if-it-is-a-example-with-webpack5-you-need-to-do)
- [switch back to webpack4 later to work with webpack4](#switch-back-to-webpack4-later-to-work-with-webpack4)
- [then](#then)
- [if you want to add dependencies to the example](#if-you-want-to-add-dependencies-to-the-example)
- [if you make changes to startserver plugin](#if-you-make-changes-to-startserver-plugin)
- [to run example tests with unreleased razzle packages with specific webpack and specific tests](#to-run-example-tests-with-unreleased-razzle-packages-with-specific-webpack-and-specific-tests)
- [Commands being run during testing puts output and puppeteer screenshots in test-artifacts/](#commands-being-run-during-testing-puts-output-and-puppeteer-screenshots-in-test-artifacts)
- [Trouble with puppeteer?](#trouble-with-puppeteer)
    - [Updating your fork](#updating-your-fork)
  - [Adding examples](#adding-examples)
    - [Use examples/basic as template](#use-examplesbasic-as-template)
    - [Naming examples](#naming-examples)
    - [How to get your example merged](#how-to-get-your-example-merged)
    - [Guidelines](#guidelines)
  - [Why wasn't my PR merged?](#why-wasnt-my-pr-merged)
  - [Getting recognition](#getting-recognition)
  - [Getting help](#getting-help)
<!-- END doctoc generated instructions please keep comment here to allow auto update -->

Razzle is monorepo made up of a several npm packages powered by Lerna.

- `examples`: All examples go in here.
- `packages`: This is where the magic happens
  - `babel-preset-razzle`: Razzle's default Babel preset.
  - `create-razzle-app`: Razzle's CLI tool responsible for initialization of new projects
  - `razzle`: The core library
  - `razzle-dev-utils`: Utilities and helpers
- `scripts`: Utility scripts related to cleaning and bootstrapping the repo
- `test`: End-to-end tests

## Developing locally

First, fork the repo to your GitHub account. Then clone your fork to your local
machine and make a new branch for your feature/bug/patch etc. It's a good idea to not develop directly on master so you can get updates.

```
git clone https://github.com/<YOUR_GITHUB_USERNAME>/razzle.git
cd razzle
git checkout -B <my-branch>
NODE_ENV=development yarn install ---ignore-engines
# optionally install add-dependencies
sudo npm install add-dependencies -g
```

This will install all `node_modules` in all the packages and symlink
inter-dependencies. Thus when you make local changes in any of the packages you can try them
immediately in all the examples. `add-dependencies` can be used to just add packages to `package.json`.

### Commands

- `yarn clean`: Clean up all `node_modules` and remove all symlinks from packages and examples.
- `yarn test --runInBand`: Runs all tests
- `yarn test:packages`: Runs tests for packages
- `yarn test:e2e`: Runs end-to-end tests
- `yarn build-docs`: Builds docs/ updates doc TOC
- `yarn publish-all-canary`: Does a `razzle@canary` release.
- `yarn publish-all-stable`: Does a a stable release(uses the npm version released of the packages)
- `yarn new-example`: Creates a new example from another example. `yarn new-example basic new-example`.
- `yarn bootstrap-examples`: Run `yarn` with specific examples as workspaces. Automatically symlinks inter-dependent modules. Run `yarn restrap` in the example to reinstall.
- `yarn test:examples:simple`: Runs tests for all simple examples (uses the npm version released of the packages)
- `yarn test:examples:complex`: Runs tests for all complex examples (uses the npm version released of the packages)
- `yarn test:examples`: Runs tests for all examples (uses the npm version released of the packages)

### Workflow for working on razzle core with examples

```bash

git clone https://github.com/<YOUR_GITHUB_USERNAME>/razzle.git
cd razzle
git checkout -b my-feature-branch canary

# or
# git checkout -b my-feature-branch master
# git checkout -b my-feature-branch three

sudo npm install add-dependencies yalc -g

pwd
# /home/oyvind/Documents/GitHub/razzle/

NODE_ENV=development yarn install ---ignore-engines

# to make sure tests pass
yarn test --runInBand

# to add a new example
yarn new-example existingexample with-somefeature

# to work on a example
cd examples/basic
example="$(basename $PWD)"
pushd ../..

# if it is a example with webpack5 you need to do
yarn add -W webpack@5.24.0 html-webpack-plugin@5.2.0

# switch back to webpack4 later to work with webpack4
yarn add -W webpack@4.46.0 html-webpack-plugin@4.5.2

# then
yarn bootstrap-examples $example
popd
yarn build

# if you want to add dependencies to the example
add-dependencies somedependency
yarn restrap

# if you make changes to startserver plugin
pushd ../..
cd packages/razzle-start-server-webpack-plugin
yarn build
popd

# to run example tests with unreleased razzle packages with specific webpack and specific tests

WEBPACK_DEPS="webpack@5.24.0 html-webpack-plugin@5.2.0" PACKAGE_MANAGER="yalc" NPM_TAG="development" yarn test:examples --runInBand -t with-tailwindcss
WEBPACK_DEPS="webpack@4.46.0 html-webpack-plugin@4.5.2" PACKAGE_MANAGER="yalc" NPM_TAG="development" yarn test:examples --runInBand -t with-tailwindcss

# Commands being run during testing puts output and puppeteer screenshots in test-artifacts/
# Trouble with puppeteer?

sudo sysctl -w kernel.unprivileged_userns_clone=1
```

### Updating your fork

When you want to pull down changes to your fork enter the following into your terminal:

```bash
git checkout master
git pull origin master
```

## Adding examples

### Use examples/basic as template
If you'd like to add an example, I suggest you duplicate the `examples/basic` folder `yarn new-example basic your-example`and use that as kind of base template. Before you start adding stuff, go ahead and change the name of the package in the your new example's `package.json`. Then go back to the project root and run `yarn bootstrap-examples your-example`. This will make sure that your new example is using your local version of all the `packages`.

### Naming examples

All example folders should be named `with-<thing-you-are-demonstrating>`. Each example's npm package name (found in it's `package.json`) should look like `razzle-examples-with-<thing-you-are-demonstrating>`.

### How to get your example merged

- Make sure to comment the important parts of your code and include a **well-written**
"Idea behind the example" section. This is more important to me than your actual code.
- Keep your example limited to one idea / library / feature (e.g. don't submit `with-styled-components-and-material-ui`). That being said, there are times when this rule will be relaxed such as if you are showing how to use Apollo and Redux or \<Flux Library\> + React Router.
- Your example **MUST** implement Hot Module Replacement. If it does not update when you make edits, you have broken something.
- Your example should be minimalistic and concise, or a direct copy of another prominent example from the original library (like copying an example directly from react-redux).

### Guidelines

[Commit message guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)

## Why wasn't my PR merged?

I will do my best to write out my reasoning before closing a PR, but 80% of the time it falls under one of these...

- You did not read this document
- Your code breaks an internal application (I will be transparent about this)
- Your code conflicts with some future plans (I will be transparent about this too)
- You've said something inappropriate or have broken the Code of Conduct

## Getting recognition

We use the project README to recognize the contributions of members of the project community.

To add a contributor: `all-contributors add github_username doc,code`

[Valid contributing keys](https://allcontributors.org/docs/en/emoji-key)

## Getting help

Tweet / DM [@jaredpalmer](https://twitter.com/jaredpalmer)
Tweet / DM [@nima_arf](https://twitter.com/nima_arf)
Tweet / DM [@fivethreeo](https://twitter.com/fivethreeo)
