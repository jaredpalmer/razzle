import { makeRouteConfig, Route } from 'found';
import React from 'react';

import FetchBoards from './board/action/FetchBoards';
const routes = (
  <Route path="/">
    <Route
      getComponent={() => import('../Home').then(module => module.default)}
      getData={({ location, context }) =>
        new Promise(resolve => {
          context.store.dispatch(new FetchBoards());
          resolve({ store: context.store });
        })
      }
    />
    <Route
      path="/about"
      getComponent={() => import('../About').then(module => module.default)}
      getData={({ location, context }) =>
        new Promise(resolve => {
          context.store.dispatch(new FetchBoards());
          resolve({ store: context.store });
        })
      }
    >
      <Route
        path="/me"
        getComponent={() => import('../components/Me').then(module => module.default)}
        getData={({ location, context }) =>
          new Promise(resolve => {
            context.store.dispatch(new FetchBoards());
            resolve({ store: context.store });
          })
        }
      />
      <Route
        path="/them"
        getComponent={() => import('../components/Me').then(module => module.default)}
        getData={({ location, context }) =>
          new Promise(resolve => {
            context.store.dispatch(new FetchBoards());
            resolve({ store: context.store });
          })
        }
      />
      <Route
        path="/us"
        getComponent={() => import('../components/Us').then(module => module.default)}
        getData={({ location, context }) =>
          new Promise(resolve => {
            context.store.dispatch(new FetchBoards());
            resolve({ store: context.store });
          })
        }
      />
    </Route>
  </Route>
);
export default makeRouteConfig(routes);
