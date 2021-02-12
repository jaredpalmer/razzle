open Utils;

requireCSS("../../../src/CommentsPage.css");

type state = {story_with_comments: option(StoryData.story_with_comments)};

type action =
  | Loaded(StoryData.story_with_comments);

[@react.component]
let make = (~id) => {
    let (state, dispatch) = React.useReducer((_state, action) =>
    switch (action) {
      | Loaded(data) =>{story_with_comments: Some(data)}
      },  {story_with_comments: None});

  let renderTitle = (story: StoryData.story_with_comments) => {
    let title =
      <h2 className="CommentsPage_title">
        {React.string(story.title)}
      </h2>;
    <div>
      {switch (story.url) {
       | Some(url) =>
         <a href=url className="CommentsPage_titleLink"> title </a>
       | None => title
       }}
    </div>;
  };
  let renderByline = (story: StoryData.story_with_comments) =>
    <div>
      <span> {React.string(string_of_int(story.score))} </span>
      {React.string(" points")}
      <span>
        <span>
          {let time = story.time
           let by = story.by
           React.string({j| submitted $time by $by|j})}
        </span>
      </span>
    </div>;
    React.useEffect0(() => {
      StoryData.fetchStoryWithComments(id, data => dispatch(Loaded(data)))
      |> ignore;
      None;
    });

      <div className="CommentsPage_container">
        {switch (state.story_with_comments) {
         | Some(story) =>
           <div>
             {renderTitle(story)}
             {renderByline(story)}
             <CommentList story />
           </div>
         | None => React.string("loading")
         }}
      </div>;
};
