let text = ReasonReact.string;

type state = {count: int};

type action =
  | Increment
  | Decrement;

let reducer = (state, action) =>
  switch (action) {
  | Increment => {count: state.count + 1}
  | Decrement => {count: state.count - 1}
  };

[@react.component]
let make = () => {
  let (state, send) = React.useReducer(reducer, {count: 0});
  let message = "Count: " ++ string_of_int(state.count);
  <div className="App-intro">
    {text(message)}
    <button onClick={_event => send(Increment)}> {text("+")} </button>
    <button onClick={_event => send(Decrement)}> {text("-")} </button>
  </div>;
};