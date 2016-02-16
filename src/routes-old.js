import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import App from './containers/App';
import PostPage from './containers/PostPage';
import PostListPage from './containers/PostListPage';
import EditorPage from './containers/EditorPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={PostListPage}/>
    <Route path="/edit" component={EditorPage}/>
    <Route path="/:slug" component={PostPage}/>
  </Route>
);
