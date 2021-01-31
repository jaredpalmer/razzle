import LocalButton from "./Button";
import React from "react";

const RemoteButton = React.lazy(() => import("app2/Button"));

const App = () => (
  <div>
    <h1>Bi-Directional</h1>
    <h2>App 1</h2>
    <LocalButton />
    <React.Suspense fallback="Loading Button">
      <RemoteButton />
    </React.Suspense>
  </div>
);

export default App;
