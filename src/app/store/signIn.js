// @flow
import cookie from 'js-cookie';
import { createAction, handleActions } from 'redux-actions';
import { signIn, getMe } from '../fetches';
import { STATUS_READY, STATUS_PROGRESS, STATUS_FINISHED } from '../../etc/define';

import type { Action } from './';
import type { User } from './users';

const { COOKIE_LOGIN_TOKEN } = process.env;

export type SignInState = {
  status: number,
  error: string | null,
  data: User | null,
  token: string | null,
};

export const SIGNIN_INIT = 'signInInt';
export const SIGNIN_ENTER = 'signInEnter';
export const SIGNIN_RESULT = 'signInResult';
export const SIGNIN_ME = 'signInMe';
export const SIGNOUT = 'signOut';

export const signInInit = createAction(SIGNIN_INIT);
export const signInEnter = createAction(SIGNIN_ENTER, (email, password) => ({ email, password }));
export const signInResult = createAction(SIGNIN_RESULT, result => result);
export const signInMe = createAction(SIGNIN_ME, result => result);
export const signOut = createAction(SIGNOUT);

// server.jsxからしか呼ばれない
export function fetchMe({ dispatch, getState }: any) {
  const { signIn: { token, status } } = getState();
  if (token && status !== STATUS_FINISHED) {
    return getMe(token).then(result => dispatch(signInMe(result)));
  }
  return null;
}

export const epics = [
  (action$: any) => (
    action$.ofType(SIGNIN_ENTER)
      .switchMap(({ payload }: Action): Promise<any> => signIn(payload))
      .do(result => {
        if (!(result instanceof Error)) {
          cookie.set(COOKIE_LOGIN_TOKEN, result.token);
        }
      })
      .map(result => signInResult(result))
  ),
  (action$: any) => (
    action$.ofType(SIGNIN_RESULT)
      .filter(({ error }) => !error)
      .switchMap(({ payload }) => getMe(payload.token))
      .map(result => signInMe(result))
  ),
  (action$: any) => (
    action$.ofType(SIGNOUT)
      .do(() => cookie.remove(COOKIE_LOGIN_TOKEN))
      .ignoreElements()
  ),
];

export const reducers = handleActions({
  [SIGNIN_INIT]: () => ({
    status: STATUS_READY,
  }),
  [SIGNIN_ENTER]: (state: SignInState) => ({
    ...state,
    status: STATUS_PROGRESS,
  }),
  [SIGNIN_RESULT]: (state: SignInState, { payload, error }: Action): SignInState => {
    if (error) {
      return {
        ...state,
        status: STATUS_READY,
        error: payload.message,
      };
    }
    return {
      ...state,
      token: payload.token,
    };
  },
  [SIGNIN_ME]: (state: SignInState, { payload }: Action) => ({
    ...state,
    data: payload,
    status: STATUS_FINISHED,
  }),
  [SIGNOUT]: (state: SignInState) => ({
    ...state,
    data: null,
    status: STATUS_READY,
  }),
}, { status: 0, data: null, error: null, token: null });
