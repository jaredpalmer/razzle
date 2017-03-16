import React from 'react';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';
import Switch from 'react-router-dom/Switch';

const App = ({ routes, initialData }) => {
  return routes
    ? <div>
        {routes.map((route, index) => (
          <Link
            style={{ marginRight: '1rem', fontFamily: 'Menlo' }}
            key={`nav-${index}`}
            to={route.path}
          >
            {route.name}
          </Link>
        ))}
        <Switch>

          {routes.map((route, index) => {
            // pass in the initialData from the server for this specific route
            return (
              <Route
                key={index}
                path={route.path}
                exact
                render={props => React.createElement(route.component, {
                  ...props,
                  initialData: initialData[index] || null,
                })}
              />
            );
          })}

        </Switch>
      </div>
    : null;
};

export default App;
