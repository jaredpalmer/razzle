open Belt;
open Utils;

type state = {
  topstories: StoryData.topstories,
  page: int,
  loading: bool,
};

type action =
  | Loaded((int, StoryData.topstories))
  | Loading;

let initialState = {topstories: [||], page: 0, loading: false};

[@react.component]
let make = () => {
  let (state, dispatch) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | Loading => {...state, loading: true}
        | Loaded((page, data)) =>
          let updatedTopstories = Array.concat(state.topstories, data);
          {topstories: updatedTopstories, page: page + 1, loading: false};
        },
      initialState,
    );
  // Using useEffect0 to run this effect one time and prevent multiple reloads of same data which crashes browser
  React.useEffect0(() => {
    StoryData.fetchTopStories(state.page, payload =>
      dispatch(Loaded(payload))
    )
    |> ignore;
    None;
  });

  React.useEffect(() => {
    let nearTheBottom = () => distanceFromBottom() < 100;
    let loadNextPage = () =>
      if (state.page < 4) {
        StoryData.fetchTopStories(state.page, payload =>
          dispatch(Loaded(payload))
        )
        |> ignore;
        dispatch(Loading);
      };
    let scrollHander = _e =>
      if (nearTheBottom() && !state.loading) {
        loadNextPage();
      };
    Webapi.Dom.window
    |> Webapi.Dom.Window.addEventListener("scroll", scrollHander);

    Some(
      () =>
        Webapi.Dom.window
        |> Webapi.Dom.Window.removeEventListener("scroll", scrollHander),
    );
  });

  <div>
    {if (Array.length(state.topstories) > 0) {
       state.topstories
       ->(
           Array.mapWithIndex((index, story)
             /* key must be a unique string attached to the story, DO NOT use index. Using just the story.id get error in browser for duplicate keys*/
             =>
               <StoryListItem
                 key={string_of_int(story.id + index)}
                 index
                 story
               />
             )
         )
       ->React.array;
     } else {
       ReasonReact.null;
     }}
  </div>;
};
