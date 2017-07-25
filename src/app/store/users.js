// @flow
import { createAction, handleActions } from 'redux-actions';
import { getUsers } from '../helpers/fetches';
import { STATUS_READY, STATUS_FINISHED } from './index';

import type { Action } from './';

export type User = {
  name: string,
  email: string
};
export type Users = Array<User>;
export type UsersState = {
  status: number,
  data: Users
};

export const USERS_START_FETCH = 'usersStartFetch';
export const USERS_RESULT = 'usersResult';

export const usersResult = createAction(USERS_RESULT, (users: Users): Users => users);
export const usersStartFetch = createAction(USERS_START_FETCH);

export const epics = [
  (action$: Observable<any>) => (
    action$.ofType(USERS_START_FETCH)
      .switchMap(() => getUsers())
      .map(result => usersResult(result))),
];

export const reducer = handleActions({
  [USERS_START_FETCH]: (): UsersState => ({
    status: STATUS_READY,
    data: [],
  }),
  [USERS_RESULT]: (state: UsersState, action: Action): UsersState => ({
    status: STATUS_FINISHED,
    data: [
      ...state.data,
      ...action.payload,
    ],
  }),
}, { status: 0, data: [] });
