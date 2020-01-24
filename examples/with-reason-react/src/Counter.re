let text = ReasonReact.string;

type state = {count: int};

type action =
  | Increment
  | Decrement;

let component = ReasonReact.reducerComponent("Counter");

/* underscore before names indicate unused variables. We name them for clarity */
let make = _children => {
  ...component,
  initialState: () => {count: 0},
  reducer: (action, state) =>
    switch (action) {
    | Increment => ReasonReact.Update({count: state.count + 1})
    | Decrement => ReasonReact.Update({count: state.count - 1})
    },
  render: self => {
    let message = "Count: " ++ string_of_int(self.state.count);
    <div className="App-intro">
      {text(message)}
      <button onClick={_event => self.send(Increment)}> {text("+")} </button>
      <button onClick={_event => self.send(Decrement)}> {text("-")} </button>
    </div>;
  },
};
