import {
  BASEMAP_ACTION_NAME,
  BASEMAP_ACTION_TYPE_ADD,
  BASEMAP_ACTION_TYPE_REARRANGE,
  BASEMAP_ACTION_TYPE_REMOVE,
  BASEMAP_ACTION_TYPE_UPDATE
} from './index'


/**
 * Add new basemap data.
 * @param {object} payload New basemap data.
 */
export function add(payload) {
  return {
    name: BASEMAP_ACTION_NAME,
    type: BASEMAP_ACTION_TYPE_ADD,
    payload: payload
  };
}


/**
 * Remove basemap data.
 * @param {object} payload Basemap data.
 */
export function remove(payload) {
  return {
    name: BASEMAP_ACTION_NAME,
    type: BASEMAP_ACTION_TYPE_REMOVE,
    payload: payload
  };
}

/**
 * Update basemap data.
 * @param {object} payload Basemap data.
 */
export function update(payload) {
  return {
    name: BASEMAP_ACTION_NAME,
    type: BASEMAP_ACTION_TYPE_UPDATE,
    payload: payload
  };
}

/**
 * Rearrange basemap data.
 * @param {object} payload Basemap data.
 */
export function rearrange(payload) {
  return {
    name: BASEMAP_ACTION_NAME,
    type: BASEMAP_ACTION_TYPE_REARRANGE,
    payload: payload
  };
}

export default {
  add, remove, update, rearrange
}