export default class AppCallError {
  public readonly type = 'APP_CALL_ERROR';
  constructor(public payload: { error: Error }) {}
}
