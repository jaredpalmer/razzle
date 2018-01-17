import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import loadInitialProps from './loadInitialProps';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      previousLocation: null,
    };
    this.prefetcherCache = {};
  }

  // only runs clizzient
  componentWillReceiveProps(nextProps, nextState) {
    const navigated = nextProps.location !== this.props.location;
    if (navigated) {
      window.scrollTo(0, 0);
      // save the location so we can render the old screen
      this.setState({
        previousLocation: this.props.location,
        data: undefined, // unless you want to keep it
      });
      loadInitialProps(this.props.routes, nextProps.location.pathname, {
        location: nextProps.location,
        history: nextProps.history,
      })
        .then(data => {
          this.setState({ previousLocation: null, data: data[0] });
        })
        .catch(e => {
          // @todo we should more cleverly handle errors???
          console.log(e);
        });
    }
  }

  prefetch = pathname => {
    loadInitialProps(this.props.routes, pathname, {
      history: this.props.history,
    })
      .then(data => {
        this.prefetcherCache = { ...this.prefetcherCache, [pathname]: data[0] };
      })
      .catch(e => console.log(e));
  };

  updateData = data => {
    this.setState({ data });
  };

  render() {
    const { previousLocation, data } = this.state;
    const { location, history, match } = this.props;
    const initialData = this.prefetcherCache[location.pathname]
      ? this.prefetcherCache[location.pathname]
      : data;

    return (
      <Switch>
        {this.props.routes.map((r, i) => (
          <Route
            key={`route--${i}`}
            path={r.path}
            exact={r.exact}
            location={previousLocation || location}
            render={props => {
              return React.createElement(r.component, {
                ...initialData,
                history,
                location: previousLocation || location,
                match,
                prefetch: this.prefetch,
              });
            }}
          />
        ))}
      </Switch>
    );
  }
}

export default withRouter(App);
