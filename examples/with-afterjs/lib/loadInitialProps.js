import { matchPath } from 'react-router-dom';

export default function loadInitialProps(routes, pathname, ctx) {
  const promises = [];
  routes.some(route => {
    const match = matchPath(pathname, route);
    if (match && route.component.getInitialProps) {
      promises.push(
        route.component.load
          ? route.component
              .load() // load it as well
              .then(() =>
                route.component
                  .getInitialProps({ match, ...ctx })
                  .catch(() => {})
              )
          : route.component.getInitialProps({ match, ...ctx }).catch(() => {})
      );
    }
    return !!match;
  });
  return Promise.all(promises);
}
