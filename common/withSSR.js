import React from 'react';
import axios from 'axios';

export default function SSR(Page) {
  class SSR extends React.Component {
    static fetchData(ctx) {
      // Need to call the wrapped components getInitialProps if it exists
      return Page.fetchData ? Page.fetchData(ctx) : Promise.resolve(null);
    }

    state = {
      data: this.props.initialData || null,
      error: null,
    };

    componentDidMount() {
      if (!this.state.data) {
        this.constructor.fetchData({ match: this.props.match, axios }).then(
          data => {
            this.setState(state => ({ data }));
          },
          error => {
            this.setState(state => ({ data: null, error: error }));
          }
        );
      }
    }

    render() {
      return (
        <Page {...this.props} data={this.state.data} error={this.state.error} />
      );
    }
  }

  SSR.displayName = `SSR(${getDisplayName(Page)})`;

  return SSR;
}

// This make debugging easier. Components will show as SSR(MyComponent) in
// react-dev-tools.
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
