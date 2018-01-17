import { matchPath } from 'react-router-dom';

/**
 * This helps us to make sure all the async code is loaded before rendering.
 */
export default function ensureReady(routes, pathname) {
  return Promise.all(
    routes.map(route => {
      const match = matchPath(pathname || window.location.pathname, route);
      if (match && route.component.load) {
        return route.component.load();
      }
      return undefined;
    })
  );
}
