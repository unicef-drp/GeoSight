import {
  INDICATOR_ACTION_NAME,
  INDICATOR_ACTION_TYPE_ADD,
  INDICATOR_ACTION_TYPE_REARRANGE,
  INDICATOR_ACTION_TYPE_REMOVE,
  INDICATOR_ACTION_TYPE_UPDATE
} from './index'


/**
 * Add new indicator data.
 * @param {object} payload New indicator data.
 */
export function add(payload) {
  return {
    name: INDICATOR_ACTION_NAME,
    type: INDICATOR_ACTION_TYPE_ADD,
    payload: payload
  };
}


/**
 * Remove indicator.
 * @param {object} payload Indicator indicator.
 */
export function remove(payload) {
  return {
    name: INDICATOR_ACTION_NAME,
    type: INDICATOR_ACTION_TYPE_REMOVE,
    payload: payload
  };
}

/**
 * Update indicator.
 * @param {object} payload Indicator indicator.
 */
export function update(payload) {
  return {
    name: INDICATOR_ACTION_NAME,
    type: INDICATOR_ACTION_TYPE_UPDATE,
    payload: payload
  };
}

/**
 * Rearrange indicator.
 * @param {object} payload Indicator indicator.
 */
export function rearrange(payload) {
  return {
    name: INDICATOR_ACTION_NAME,
    type: INDICATOR_ACTION_TYPE_REARRANGE,
    payload: payload
  };
}

export default {
  add, remove, update, rearrange
}