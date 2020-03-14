import fetch from 'isomorphic-fetch';
import { catchError, delay, filter, flatMap, map } from 'rxjs/operators';

import Epic from '../Epic';

import AppCallError from '../app/action/AppCallError';
import SetBoards from './action/SetBoards';
import SetBoardsLoading from './action/SetBoardsLoading';

import Board from './Board';

export const boardsLoading: Epic = (action$, state$) =>
  action$.pipe(
    filter(action => action.type === 'FETCH_BOARDS'),
    map(() => {
      return new SetBoardsLoading(true);
    }),
  );

export const fetchBoards: Epic = action$ =>
  action$.pipe(
    filter(action => action.type === 'FETCH_BOARDS'),
    delay(2000),
    flatMap(() => {
      return fetch('https://jsonplaceholder.typicode.com/albums');
    }),
    flatMap(response => response.json()),
    map(body => body as Board[]),
    flatMap((boards: Board[]) => [
      new SetBoards({ boards: [{ id: 'test', name: 'board', widgets: [] }] }),
      new SetBoardsLoading(false),
    ]),
    catchError((error: Error) => [new AppCallError({ error }), new SetBoardsLoading(false)]),
  );
