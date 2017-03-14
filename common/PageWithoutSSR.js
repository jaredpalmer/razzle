import React, { Component } from 'react';

class PageWithoutSSR extends Component {
  state = {
    data: null,
    error: null,
  };

  render() {
    return (
      <div>
        Page without SSR
      </div>
    );
  }
}

export default PageWithoutSSR;
