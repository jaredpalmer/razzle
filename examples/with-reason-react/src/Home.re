let text = ReasonReact.stringToElement;

let component = ReasonReact.statelessComponent("Home");

/* underscore before names indicate unused variables. We name them for clarity */
let make = _children => {
  ...component,
  render: _self =>
    <p className="App-intro">
      <code> (test("src/App.re")) </code>
      (
        test(
          ". When you make edits, both the server and broswer will hot reload."
        )
      )
    </p>
};
