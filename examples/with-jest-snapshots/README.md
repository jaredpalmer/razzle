# Using Razzle and Jest Snapshots

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the finch release documentation for this example

Create and start the example:

```bash
npx create-razzle-app@finch --example with-jest-snapshots with-jest-snapshots

cd with-jest-snapshots
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This is an example of how to use [Jest Snapshots](http://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest) with a Razzle project.

> Snapshot tests are a very useful tool whenever you want to make sure your UI does not change unexpectedly.
> A typical snapshot test case for a mobile app renders a UI component, takes a screenshot, then compares it to a reference image stored alongside the test. The test will fail if the two images do not match: either the change is unexpected, or the screenshot needs to be updated to the new version of the UI component.


```js
// src/__tests__/Home.test.js

import React from 'react';
import renderer from 'react-test-renderer';
import Home from '../Home';

it('renders Home correctly', () => {
  const tree = renderer.create(<Home />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

When you run `yarn test`, a snapshot file is generated that looks like:

```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`renders Home correctly 1`] = `
<div>
  Hello World!
</div>
`;
```

Refer to the [Jest documentation](http://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest) for more information.
