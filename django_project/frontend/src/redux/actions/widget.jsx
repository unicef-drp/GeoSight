import {
  WIDGET_ACTION_NAME,
  WIDGET_ACTION_TYPE_ADD,
  WIDGET_ACTION_TYPE_REMOVE,
  WIDGET_ACTION_TYPE_UPDATE
} from '../reducers/dashboard'

export function add(payload) {
  return {
    name: WIDGET_ACTION_NAME,
    type: WIDGET_ACTION_TYPE_ADD,
    payload: payload
  };
}

export function remove(idx) {
  return {
    name: WIDGET_ACTION_NAME,
    type: WIDGET_ACTION_TYPE_REMOVE,
    payload: idx
  };
}

export function update(idx, payload) {
  return {
    name: WIDGET_ACTION_NAME,
    type: WIDGET_ACTION_TYPE_UPDATE,
    idx: idx,
    payload: payload
  };
}

export default {
  add, remove, update
}