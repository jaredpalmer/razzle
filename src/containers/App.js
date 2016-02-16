import React, { PropTypes } from 'react';
import Nav from '../components/Nav';

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
        <Nav/>
      {children}
    </div>
  );
};

export default App;
