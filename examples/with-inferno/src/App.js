import Inferno from "inferno";
import Component from "inferno-component";
import InfernoLogo from "./inferno.svg";

class App extends Component {
  render() {
    return (
      <div class="inferno">
        <img src={InfernoLogo} alt="Inferno Logo" />
        Hello Inferno!
      </div>
    );
  }
}

export default App;
