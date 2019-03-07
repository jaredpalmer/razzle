import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import './App.css';

const GET_POSTS = gql`
  {
    posts {
      id
      title
    }
  }
`;

const App = () => (
  <React.Fragment>
    <h1>Welcome to Razzle.</h1>
    <p>example of title posts</p>
    <Query query={GET_POSTS}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error! {error.message}</div>;

        return (
          <ul>{data.posts.map(post => <li key={post.id}>{post.title}</li>)}</ul>
        );
      }}
    </Query>
  </React.Fragment>
);

export default App;
