import React from 'react';
import { hydrate } from 'react-dom';
import theme from './theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';

hydrate(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root'),
  () => {
    // [ReHydratation](https://github.com/cssinjs/jss/blob/master/docs/ssr.md)
    const jssStyles = document.getElementById('jss-ssr');
    if (jssStyles && jssStyles.parentNode)
      jssStyles.parentNode.removeChild(jssStyles);
  }
);

if (module.hot) {
  module.hot.accept();
}
