import FetchBoards from './FetchBoards';
import PutBoard from './PutBoard';
import SetBoards from './SetBoards';
import SetBoardsLoading from './SetBoardsLoading';

type BoardAction = FetchBoards | PutBoard | SetBoards | SetBoardsLoading;

export default BoardAction;
