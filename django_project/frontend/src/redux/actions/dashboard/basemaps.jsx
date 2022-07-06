import {
  BASEMAP_ACTION_NAME,
  BASEMAP_ACTION_TYPE_ADD,
  BASEMAP_ACTION_TYPE_REMOVE,
  BASEMAP_DEFAULT_ACTION_NAME,
  BASEMAP_DEFAULT_ACTION_TYPE_CHANGE
} from '../../reducers/dashboard/dashboard'


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
 * Change default basemap
 * @param {object} payload Basemap data.
 */
export function changeDefault(payload) {
  return {
    name: BASEMAP_DEFAULT_ACTION_NAME,
    type: BASEMAP_DEFAULT_ACTION_TYPE_CHANGE,
    payload: payload
  };
}

export default {
  add, remove, changeDefault
}