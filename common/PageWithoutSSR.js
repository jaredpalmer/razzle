import React, { Component } from 'react';
import Helmet from 'react-helmet'

class PageWithoutSSR extends Component {
  state = {
    data: null,
    error: null,
  };

  render() {
    return (
      <div>
        <Helmet title="About" />
        Page without SSR
       
      </div>
    );
  }
}

export default PageWithoutSSR;
