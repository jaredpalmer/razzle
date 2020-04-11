[@react.component]
let make = (~href, ~className="", ~children) => {
  let handleClick = (href, event) =>
    if (!ReactEvent.Mouse.defaultPrevented(event)) {
      ReactEvent.Mouse.preventDefault(event);
      ReasonReactRouter.push(href);
    };
  <a href className onClick={event => handleClick(href, event)}>
    children
  </a>;
};