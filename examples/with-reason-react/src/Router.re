type state = ReasonReact.Router.url;

type action =
  | UpdateRoute(ReasonReact.Router.url);

/* copied from  ReasonReact */
let urlToUrlList = url =>
  switch (url) {
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

[@react.component]
let make = (~initialUrl, ~children) => {
  let initialState = {
    switch (initialUrl) {
    | Some(url) => (
        {path: urlToUrlList(url), hash: "", search: ""}: ReasonReactRouter.url
      )
    | None => ReasonReactRouter.dangerouslyGetInitialUrl()
    };
  };
  let (state, send) =
    React.useReducer(
      (_, action) =>
        switch (action) {
        | UpdateRoute(url) => url
        },
      initialState,
    );
  React.useEffect1(
    () => {
      let watcherID =
        ReasonReact.Router.watchUrl(url => send(UpdateRoute(url)));
      Some(() => ReasonReact.Router.unwatchUrl(watcherID));
    },
    [|initialUrl|],
  );
  children(state);
};