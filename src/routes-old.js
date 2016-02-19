import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import App from './routes/App';
import PostPage from './routes/Post';
import PostListPage from './routes/PostList';
import EditorPage from './routes/Editor/components/Editor';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={PostListPage}/>
    <Route path="/edit" component={EditorPage}/>
    <Route path="/:slug" component={PostPage}/>
  </Route>
);
