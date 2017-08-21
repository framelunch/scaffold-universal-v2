// @flow
import { createAction, handleActions } from 'redux-actions';

export type LoadingState = number;

const CREATE_LOADING = 'createLoading';
const REMOVE_LOADING = 'removeLoading';

export const createLoading = createAction(CREATE_LOADING);
export const removeLoading = createAction(REMOVE_LOADING);

export const epics = [];

export const reducers = handleActions({
  [CREATE_LOADING]: (state: LoadingState): LoadingState => state + 1,
  [REMOVE_LOADING]: (state: LoadingState): LoadingState => state - 1,
}, 0);
