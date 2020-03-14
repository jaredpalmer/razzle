import { Store as ReduxStore } from 'redux';

import Action from './Action';
import State from './State';

type Store = ReduxStore<State, Action>;

export default Store;
