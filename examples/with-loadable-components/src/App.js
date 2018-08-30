import './App.css';
import React from 'react';
import loadable from 'loadable-components';

const Header = loadable(() =>
  import(/* webpackChunkName: "header" */ './Header')
);
const Body = loadable(() => import(/* webpackChunkName: "body" */ './Body'));
const Footer = loadable(() =>
  import(/* webpackChunkName: "footer" */ './Footer')
);

const App = () => (
  <div>
    <h3>Welcome to the Razzle</h3>
    <Header />
    <Body />
    <Footer />
  </div>
);

export default App;
