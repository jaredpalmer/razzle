import Action from '../Action';
import State from './State';

const initialState: State = {
  list: [],
  loading: false,
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'SET_BOARDS_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_BOARDS':
      return {
        ...state,
        list: state.list.concat(action.payload.boards),
      };

    default:
      return state;
  }
};

export default reducer;
