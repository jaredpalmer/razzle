/** @jsx h */
import { h } from 'hyperapp';

import HyperappLogo from './hyperapp.svg';
import './App.css';

const App = ({ state, actions }) => (
  <div class="App">
    <img src={HyperappLogo} alt="Hyperapp Logo" />
    <p>Hello Hyperapp!</p>

    <h3>Count is {state.count}</h3>

    <button onclick={() => actions.up(1)}>up</button>
    <button onclick={() => actions.down(1)}>down</button>
  </div>
);
export default App;
