import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const ARTICLES = gql`
  {
    articles {
      id
      author {
        name
      }
    }
  }
`;

class Home extends React.Component {
  render() {
    return (
      <Query query={ARTICLES}>
        {({ data, loading }) => {
          if (loading) return <h2>Loading ...</h2>;
          return (
            <div>
              {data.articles.map(a => (
                <li key={a.id}>{a.author.name}</li>
              ))}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Home;
