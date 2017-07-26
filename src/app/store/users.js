// @flow
import { createAction, handleActions } from 'redux-actions';
import { getUsers } from '../helpers/fetches';
import { STATUS_FINISHED } from './index';

import type {Dispatch} from "redux";
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

export const USERS_RESULT = 'usersResult';

export const usersResult = createAction(USERS_RESULT, (users: Users): Users => users);

export function fetchUsers({ dispatch, getState }: any) {
  const { users } = getState();
  if (users.status !== STATUS_FINISHED) {
    return getUsers().then(result => dispatch(usersResult(result)));
  }
}

export const epics = [];

export const reducer = handleActions({
  [USERS_RESULT]: (state: UsersState, action: Action): UsersState => ({
    status: STATUS_FINISHED,
    data: [
      ...state.data,
      ...action.payload,
    ],
  }),
}, { status: 0, data: [] });
