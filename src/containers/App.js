import React, { PropTypes } from 'react';

const App = ({ children }) => {
  return (
    <div>
        <h2 style={{
              textAlign: 'center',
              lineHeight: 1,
              marginBottom: 0,
            }}>
          React Nation
        </h2>
      {children}
    </div>
  );
};

export default App;
