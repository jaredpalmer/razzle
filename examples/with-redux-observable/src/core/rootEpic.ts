import { combineEpics } from 'redux-observable';

import * as boardEpics from './board/epics';

export default combineEpics(...Object.values(boardEpics));
