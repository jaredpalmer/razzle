import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { GreenPage } from './pages/green/green.page';
import { HomePage } from './pages/home/home.page';
import { Footer } from './components/footer';
import { Header } from './components/header';

const Root = styled.div`
  width: 980px;
  margin: auto;
`;

const App = () => (
  <Root>
    <Header />
    <div>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/green" component={GreenPage} />
      </Switch>
    </div>
    <Footer />
  </Root>
);

export default App;
