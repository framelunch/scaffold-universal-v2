// @flow
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import * as loading from './loading';
import * as popup from './popup';
import * as signIn from './signIn';
import * as users from './users';

import type { LoadingState } from './loading';
import type { PopupState } from './popup';
import type { SignInState } from './signIn';
import type { UsersState } from './users';


export type Action = {
  type: string,
  payload: any,
  meta: any,
  error: boolean,
};
export type AppState = {
  loading: LoadingState,
  popup: PopupState,
  signIn: SignInState,
  users: UsersState,
};

export default function (stateData: any) {
  return createStore(
    combineReducers({
      token: (token = null) => token,
      load: loading.reducers,
      popup: popup.reducers,
      signIn: signIn.reducers,
      users: users.reducers,
    }),
    stateData,
    applyMiddleware(createEpicMiddleware(
      combineEpics(
        ...loading.epics,
        ...popup.epics,
        ...signIn.epics,
        ...users.epics,
      ),
    )),
  );
}
