let component = ReasonReact.statelessComponent("Link");

let make = (~href, ~className="", children) => {
  ...component,
  render: self =>
    ReasonReact.createDomElement(
      "a",
      ~props={
        "className": className,
        "href": href,
        "onClick":
          self.handle((event, _self) => {
            ReactEventRe.Mouse.preventDefault(event);
            ReasonReact.Router.push(href);
          })
      },
      children
    )
};
