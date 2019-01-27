import React from 'react';
import logo from './react.svg';
import './Home.css';

class Home extends React.Component {
  state = {
    users: null,
  };

  async componentDidMount() {
    try {
      const res = await fetch('/rest/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const users = await res.json();

      this.setState({
        users,
      });
    } catch (err) {
      throw err;
    }
  }

  render() {
    const { users } = this.state;
    return (
      <div className="Home">
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to Razzle</h2>
        </div>
        <p className="Home-intro">
          To get started, edit <code>src/App.js</code> or{' '}
          <code>src/Home.js</code> and save to reload.
        </p>
        <ul className="Home-resources">
          <li>
            <a href="https://github.com/jaredpalmer/razzle">Docs</a>
          </li>
          <li>
            <a href="https://github.com/jaredpalmer/razzle/issues">Issues</a>
          </li>
          <li>
            <a href="https://palmer.chat">Community Slack</a>
          </li>
        </ul>
        <h3>Users</h3>
        {users &&
          users.map(({ id, username, email }) => (
            <div key={id}>
              {username} - {email}
            </div>
          ))}
      </div>
    );
  }
}

export default Home;
