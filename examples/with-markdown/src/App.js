import "./App.css";

import React from "react";
import markdown from './App.md';

const App = () => (
  <div>
    <div>Welcome to Razzle.</div>
    <div dangerouslySetInnerHTML={{ __html: markdown }}/>
    <div className="info">Hot reload enabled!!</div>
  </div>
);

export default App;
