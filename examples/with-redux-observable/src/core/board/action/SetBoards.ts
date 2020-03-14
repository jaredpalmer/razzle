import Board from '../Board';

export default class SetBoards {
  public readonly type = 'SET_BOARDS';
  constructor(public payload: { boards: Board[] }) {}
}
