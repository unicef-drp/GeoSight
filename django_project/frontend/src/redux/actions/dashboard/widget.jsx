import {
  WIDGET_ACTION_NAME,
  WIDGET_ACTION_TYPE_ADD,
  WIDGET_ACTION_TYPE_REMOVE,
  WIDGET_ACTION_TYPE_UPDATE
} from '../../reducers/dashboard/widgets'

/**
 * Add new Widget.
 * @param {object} payload New widget data.
 */
export function add(payload) {
  return {
    name: WIDGET_ACTION_NAME,
    type: WIDGET_ACTION_TYPE_ADD,
    payload: payload
  };
}

/**
 * Remove widget on an index.
 * @param {int} idx Index of widget from list of widgets.
 */
export function remove(idx) {
  return {
    name: WIDGET_ACTION_NAME,
    type: WIDGET_ACTION_TYPE_REMOVE,
    idx: idx
  };
}

/**
 * Update specific widget data on an index.
 * @param {int} idx Index of widget from list of widgets.
 * @param {object} payload New widget data.
 */
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