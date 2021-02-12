open Utils;

requireCSS("../../../src/NotFound.css");

let notFoundImage = requireAssetURI("../../../src/notfound404.png");

[@react.component]
let make = () =>
  <div className="NotFound_container">
    <div className="NotFound_image">
      <img alt="Page not found" src=notFoundImage />
    </div>
    <div className="NotFound_text">
      <span>
        {React.string(
           "The page you're looking for can't be found. Go home by ",
         )}
      </span>
      <Link href="/"> {React.string("clicking here!")} </Link>
    </div>
  </div>;
