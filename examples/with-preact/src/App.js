import { h } from 'preact';
import { useState } from 'preact/hooks';
import PreactLogo from './preact.svg';
/** @jsx h */

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <main class="Preact">
      <img src={PreactLogo} alt="Preact Logo" />
      Hello Preact!
      <p>Count: {count}</p>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)}>+</button>
    </main>
  );
};

export default App;
