// @flow
import { createAction, handleActions } from 'redux-actions';
import type { Action } from './';

export type Popup = any;
export type PopupState = Array<Popup>;

export const POPUP_TYPE_ERROR = 'error';
export const POPUP_TYPE_ALERT = 'alert';
export const POPUP_TYPE_CONFIRM = 'confirm';
export const POPUP_TYPE_CUSTOM = 'custom';

let id = 0;
const CREATE_ERROR_POPUP = 'createErrorPopup';
const CREATE_ALERT_POPUP = 'createAlertPopup';
const CREATE_CONFIRM_POPUP = 'createConfirmPopup';
const CREATE_CUSTOM_POPUP = 'createCustomPopup';
const REMOVE_POPUP = 'removePopup';
const DESTROY_POPUP = 'destroyPopup';

function generate({ type, data }) {
  id += 1;
  return { id, type, data };
}

export const createErrorPopup = createAction(CREATE_ERROR_POPUP, error => error);
export const removePopup = createAction(REMOVE_POPUP);

export const epics = [];

export const reducers = handleActions({
  [CREATE_ERROR_POPUP]: (state: PopupState, { payload }: Action): PopupState => (
    [...state, generate({ type: POPUP_TYPE_ERROR, data: payload })]
  ),
  [REMOVE_POPUP]: (state: PopupState, { payload }: Action): PopupState => (
    state.filter(item => item.id !== payload)
  ),
}, []);
