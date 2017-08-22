// @flow
import { createAction, handleActions } from 'redux-actions';
import { graphql } from '../fetches';
import { STATUS_FINISHED } from '../../etc/define';

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
    return graphql(`
    query($limit: Int, $page: Int, $sort: String) {
      userList(limit: $limit, page: $page, sort: $sort){ _id, name }
    }
    `, { limit: 100, page: 0, sort: '-_id' })
      .then(({ data: { userList } }) => dispatch(usersResult(userList)));
  }
  return null;
}

export const epics = [];

export const reducers = handleActions({
  [USERS_RESULT]: (state: UsersState, action: Action): UsersState => ({
    status: STATUS_FINISHED,
    data: [
      ...state.data,
      ...action.payload,
    ],
  }),
}, { status: 0, data: [] });
