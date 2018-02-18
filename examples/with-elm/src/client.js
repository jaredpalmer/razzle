var Elm = require('./Main');

// We need embed the Elm app to the div, if we call fullscreen we will have duplicated html
Elm.Main.embed(document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
