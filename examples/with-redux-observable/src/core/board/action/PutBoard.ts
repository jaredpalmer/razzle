import Board from '../Board';

export default class PutBoard {
  public readonly type = 'PUT_BOARD';
  constructor(public payload: { board: Board; reason?: string }) {}
}
