import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ensureReady, After } from '@jaredpalmer/after';
import { AppRegistry } from 'react-native-web';
import { ApolloProvider } from 'react-apollo';
import { createApolloClient } from './apollo';
import routes from './routes';

const client = createApolloClient();

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <After data={this.props.data} routes={routes} />
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

ensureReady(routes).then(data => {
  AppRegistry.registerComponent('App', () => App);
  AppRegistry.runApplication('App', {
    initialProps: {
      data,
    },
    rootTag: document.getElementById('root'),
  });
});

if (module.hot) {
  module.hot.accept();
}
