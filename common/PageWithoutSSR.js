import React, { Component } from 'react';

class PageWithoutSSR extends Component {
  render() {
    return (
      <div>
        This is not rendered on the server
      </div>
    );
  }
}

export default PageWithoutSSR;
