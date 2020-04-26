import { h, Component } from "preact";
import PreactLogo from "./preact.svg";
/** @jsx h */

class App extends Component {
  // Preact!
  render(props, state) {
    return (
      <div class="Preact">
        <img src={PreactLogo} alt="Preact Logo" />
        Hello Preact!
      </div>
    );
  }
}

export default App;
