import React, { Component } from 'react';

class PageWithoutSSR extends Component {
  state = {
    data: null,
    error: null
  };

  componentDidMount() {
    const promise = new Promise(function(resolve, reject) {
      setTimeout(
        function() {
          resolve([{ id: '123', name: 'michael' }, { id: '124', name: 'ian' }]);
        },
        1500
      );
    });

    promise.then(data => this.setState({ data })).catch(e => console.log(e));
  }

  render() {
    return (
      <div>
        Pages
        {this.state.data === null
          ? <div>client loading...</div>
          : <div>
              {this.state.data &&
                this.state.data.length > 0 &&
                this.state.data.map(t => <div key={t.id}>client {t.name}</div>)}
            </div>}
      </div>
    );
  }
}

export default PageWithoutSSR;
