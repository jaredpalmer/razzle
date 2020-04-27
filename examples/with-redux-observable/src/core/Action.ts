import { Action as AppAction } from './app';
import { Action as BoardAction } from './board';

type Action = AppAction | BoardAction;

export default Action;
