import { provideHooks } from 'redial';
import React, { PropTypes } from 'react';
import { fetch } from '../actions/PostActions';

const PostListPage = (props) =>
  <div>PostListPage</div>;

const hooks = {
  fetch: ({ dispatch }) => dispatch(fetch()),
};

export default provideHooks(hooks)(PostListPage);
