import React from 'react';
import { connect } from 'react-redux';

import FetchBoards from '../core/board/action/FetchBoards';
import { Dispatch } from '../core/Dispatch';

class Us extends React.Component<{ dispatch: Dispatch }> {
  public render() {
    const { dispatch } = this.props;
    return (
      <button
        onClick={() => {
          dispatch(new FetchBoards());
        }}
      >
        Click Us
      </button>
    );
  }
}

export default connect()(Us);
