import { Link } from 'found';
import React from 'react';
import { connect } from 'react-redux';

import { State as BoardState } from './core/board';
import State from './core/State';

class About extends React.Component<{ board: BoardState }> {
  public render() {
    const { board } = this.props;
    console.log('"About" props in render', this.props);
    return (
      <div>
        <h1>About</h1>
        <Link to="/">Home -></Link>
        <br />
        <Link to="/about">About -></Link>
        <br />
        <Link to="/about/me">Me -></Link>
        <br />
        <Link to="/about/them">Them -></Link>
        <br />
        <Link to="/about/us">Us -></Link>
        <div>
          {board.list.map((boardItem, index) => (
            <p key={index}>{boardItem.name}</p>
          ))}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default connect(({ board }: State) => ({ board }))(About);
