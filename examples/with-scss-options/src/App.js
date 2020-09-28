import "./App.scss";
import styles from "./app.module.scss";

import React from "react";

const App = () => (
  <div>
    <div className={styles.hello}>Welcome to Razzle.</div>
    <div className="info">Hot reload enabled!!</div>
  </div>
);

export default App;
