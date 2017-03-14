import React, { Component } from 'react';
import SSR from './withSSR';

class Settings extends Component {
  static fetchData({ match, req, res, axios }) {
    // going to want `match` in here for params, etc.
    // return axios.get('http://localhost:8080/v1/tag').then(res => res.data.data);
    return new Promise(function(resolve, reject) {
      setTimeout(
        function() {
          resolve({
            friends: [
              { id: '12342', name: 'brent' },
              { id: '124234', name: 'jared' },
            ],
            currentRoute: match.path,
          });
        },
        500
      );
    });
  }

  render() {
    return (
      <div>
        Jaredsss
        {this.props.data === null
          ? <div>
              this is a loading stsssate. It will only show if user navigates to this route from somewhere else.
            </div>
          : <div>
              {this.props.data &&
                this.props.data.friends &&
                this.props.data.friends.length > 0 &&
                this.props.data.friends.map(t => (
                  <div key={t.id}>{t.name}</div>
                ))}
            </div>}
      </div>
    );
  }
}

export default SSR(Settings);
