import React from 'react';

const App = () => (
  <div
    onClick={() => {
      throw new Error('fuck');
    }}
  >
    Welcome to Razzle.
  </div>
);

export default App;
