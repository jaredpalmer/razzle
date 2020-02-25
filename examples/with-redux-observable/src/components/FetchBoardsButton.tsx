import React from 'react';
import { connect } from 'react-redux';

import FetchBoards from '../core/board/action/FetchBoards';
import { Dispatch } from '../core/Dispatch';

const FetchBoardsButton = ({ dispatch }: { dispatch: Dispatch }) => (
  <button
    onClick={() => {
      dispatch(new FetchBoards());
    }}
  >
    FetchBoards
  </button>
);

export default connect()(FetchBoardsButton);
