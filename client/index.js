import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import App from '../common/App';
import routes from '../common/routes';

render(
  <AppContainer>
    <BrowserRouter>
      <App routes={routes} initialData={window.DATA} />
    </BrowserRouter>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('../common/App', () => {
    render(
      <AppContainer>
        <BrowserRouter>
          <App routes={routes} initialData={window.DATA} />
        </BrowserRouter>
      </AppContainer>,
      document.getElementById('../common/App')
    );
  });
}
