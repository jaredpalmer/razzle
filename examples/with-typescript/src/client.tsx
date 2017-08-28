import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

const render = (Comp: any) => {
  ReactDOM.render(<Comp />, document.getElementById('root'));
};

render(App);

if (module.hot) {
  module.hot.accept();
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}
