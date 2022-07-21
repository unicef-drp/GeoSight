import {
  INDICATOR_ACTION_NAME,
  INDICATOR_ACTION_TYPE_ADD,
  INDICATOR_ACTION_TYPE_REARRANGE,
  INDICATOR_ACTION_TYPE_REMOVE,
  INDICATOR_ACTION_TYPE_UPDATE,
  INDICATOR_ACTION_TYPE_UPDATE_LEVEL
} from './index'


/**
 * Update level name
 * @param {int} id Id of data.
 * @param {String} reporting_level Reporting level that will be changed.
 */
export function updateLevel(id, reporting_level) {
  return {
    name: INDICATOR_ACTION_NAME,
    type: INDICATOR_ACTION_TYPE_UPDATE_LEVEL,
    id: id,
    reporting_level: reporting_level
  };
}


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
  add, remove, update, updateLevel, rearrange
}