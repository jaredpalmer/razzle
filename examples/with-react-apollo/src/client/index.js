import Routes from "../common/Routes";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { hydrate } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { createClient } from "../lib/apollo";

const client = createClient();

hydrate(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
