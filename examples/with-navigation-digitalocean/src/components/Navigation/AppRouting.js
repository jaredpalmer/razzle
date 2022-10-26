import React from 'react';
import { Route } from 'react-router-dom';
import home from '../../pages/home';
import page1 from '../../pages/page1';
import page2 from '../../pages/page2';

function AppRouting() {
  return (
    <div>
      <Route exact path="/" component={home} />
      <Route path="/page1" component={page1} />
      <Route path="/page2" component={page2} />
    </div>
  );
}

export default AppRouting;
