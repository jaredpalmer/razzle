import { render } from 'inferno';
import App from './App';

if (module.hot) {
  require('inferno-devtools');
}

render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
