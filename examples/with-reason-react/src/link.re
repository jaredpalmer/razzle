let handleClick = (href, event) =>
  if (!ReactEvent.Mouse.defaultPrevented(event)) {
    ReactEvent.Mouse.preventDefault(event);
    ReasonReact.Router.push(href);
  };
[@react.component]
let make = (~href, ~className="", ~children) =>
  <a href className onClick={event => handleClick(href, event)}>
    children
  </a>;
