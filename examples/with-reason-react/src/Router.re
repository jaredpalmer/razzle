type action =
  | UpdateRoute(ReasonReact.Router.url);

type state = ReasonReact.Router.url;

let component = ReasonReact.reducerComponent("Router");

let make:
  (~initialUrl: option(string), 'a) => ReasonReact.component(state, _, action) =
  (~initialUrl, children) => {
    ...component,
    initialState: () =>
      switch initialUrl {
      | Some(url) => {path: [url], hash: "", search: ""}
      | None => ReasonReact.Router.dangerouslyGetInitialUrl()
      },
    reducer: (action, _state) =>
      switch action {
      | UpdateRoute(url) => ReasonReact.Update(url)
      },
    subscriptions: ({send}) => [
      Sub(
        () => ReasonReact.Router.watchUrl(url => send(UpdateRoute(url))),
        ReasonReact.Router.unwatchUrl
      )
    ],
    render: ({state}) => children(state)
  };
