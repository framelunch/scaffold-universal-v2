// @flow
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import * as users from './users';
import * as signIn from './signIn';

import type { SignInState } from './signIn';
import type { UsersState } from './users';

export type Action = {
  type: string,
  payload: any,
  meta: any,
  error: boolean,
};
export type AppState = {
  signIn: SignInState,
  users: UsersState
};

export const STATUS_READY = 0;
export const STATUS_PROGRESS = 1;
export const STATUS_CANCELED = 3;
export const STATUS_PROBLEM = 4;
export const STATUS_FINISHED = 9;

export const initStore = (stateData: any) => (
  createStore(
    combineReducers({
      users: users.reducer,
      signIn: signIn.reducer,
    }),
    stateData,
    applyMiddleware(createEpicMiddleware(
      combineEpics(
        ...signIn.epics,
        ...users.epics,
      ),
    )),
  )
);
