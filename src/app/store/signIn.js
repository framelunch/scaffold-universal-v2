// @flow
import cookie from 'js-cookie';
import { createAction, handleActions } from 'redux-actions';
import { STATUS_FINISHED } from '../../etc/define';

import type { Action } from './';
import type { User } from './users';

const { COOKIE_LOGIN_TOKEN } = process.env;

export type SignInState = {
  status: number,
  data: User | null
};

export const SIGNIN = 'signIn';
export const SIGNOUT = 'signOut';

export const signIn = createAction(SIGNIN, result => result);
export const signOut = createAction(SIGNOUT);

export const epics = [
  (action$: any) => (
    action$.ofType(SIGNOUT)
      .do(() => {
        if (typeof COOKIE_LOGIN_TOKEN === 'string') {
          cookie.remove(COOKIE_LOGIN_TOKEN);
        }
        location.href = '/signin';
      })
      .ignoreElements()
  ),
];

export const reducers = handleActions({
  [SIGNOUT]: (state: SignInState) => (state),
  [SIGNIN]: (state: SignInState, { payload }: Action) => ({
    data: payload,
    status: STATUS_FINISHED,
  }),
}, { status: 0, data: null });
