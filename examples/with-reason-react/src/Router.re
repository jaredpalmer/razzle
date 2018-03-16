type action =
  | UpdateRoute(ReasonReact.Router.url);

type state = ReasonReact.Router.url;

/* copied from  ReasonReact */
let urlToUrlList = url =>
  switch url {
  | ""
  | "/" => []
  | _ =>
    /* remove the preceeding /, which every pathname seems to have */
    let raw = Js.String.sliceToEnd(~from=1, url);
    /* remove the trailing /, which some pathnames might have. Ugh */
    let raw =
      switch (Js.String.get(raw, Js.String.length(raw) - 1)) {
      | "/" => Js.String.slice(~from=0, ~to_=-1, raw)
      | _ => raw
      };
    raw |> Js.String.split("/") |> Array.to_list;
  };

let component = ReasonReact.reducerComponent("Router");

let make:
  (~initialUrl: option(string), 'a) => ReasonReact.component(state, _, action) =
  (~initialUrl, children) => {
    ...component,
    initialState: () =>
      switch initialUrl {
      | Some(url) => {path: urlToUrlList(url), hash: "", search: ""}
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
