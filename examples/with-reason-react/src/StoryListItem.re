open Utils;

requireCSS("../../../src/StoryListItem.css");

let commentIcon = requireAssetURI("../../../src/comment.png");

[@react.component]
let make = (~story: StoryData.story, ~index: int, ()) => {
  let renderIndex = () =>
    <aside className="StoryListItem_storyIndex">
      {React.string(string_of_int(index + 1))}
    </aside>;
  let renderTitle = () => {
    let content = React.string(story.title);
    <header className="StoryListItem_storyTitle">
      {switch (story.url) {
       | Some(url) =>
         <a href=url className="StoryListItem_link" target="_blank">
           content
         </a>
       | None =>
         <Link
           href={"/comments/" ++ string_of_int(story.id)}
           className="StoryListItem_link">
           content
         </Link>
       }}
    </header>;
  };
  let renderByline = () =>
    <div className="StoryListItem_row StoryListItem_byline">
      /* TODO: badge */

        <span className="StoryListItem_number">
          <b> {React.string(string_of_int(story.score))} </b>
          {React.string(" points")}
        </span>
        <span className="StoryListItem_storyTime">
          {let time = story.time
           let by = story.by
           React.string({j| submitted $time by $by|j})}
        </span>
      </div>;
  let renderArticleButton = () =>
    <div className="StoryListItem_flexRow">
      {renderIndex()}
      <div className="StoryListItem_storyCell">
        {renderTitle()}
        {renderByline()}
      </div>
    </div>;
  let renderCommentsButton = () =>
    <div className="StoryListItem_commentsCell">
      <Link
        href={"/comments/" ++ string_of_int(story.id)}
        className="StoryListItem_link">
        <div>
          <img alt="comments" className="StoryListItem_icon" src=commentIcon />
        </div>
        <div>
          <span className="StoryListItem_commentsText">
            <span className="StoryListItem_number">
              {React.string(string_of_int(story.descendants))}
            </span>
            {React.string(" comments")}
          </span>
        </div>
      </Link>
    </div>;
      <div className="StoryListItem_itemRow">
        {renderArticleButton()}
        {renderCommentsButton()}
      </div>;
};
