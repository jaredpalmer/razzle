import React, { Component } from 'react';
import SSR from './withSSR';
import Helmet from 'react-helmet';
import TwitterIcon from './twitter.svg';

class PageWithSSR extends Component {
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
        <Helmet title="Home" />
        <a href="https://twitter.com/jaredpalmer" target="_blank">
          <TwitterIcon
            fill="#1da1f2"
            height="30"
            width="30"
            style={{ verticalAlign: 'middle' }}
          />
        </a>
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

export default SSR(PageWithSSR);
