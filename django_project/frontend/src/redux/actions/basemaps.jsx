import {
  BASEMAP_ACTION_NAME,
  BASEMAP_ACTION_TYPE_ADD,
  BASEMAP_ACTION_TYPE_REMOVE,
  BASEMAP_DEFAULT_ACTION_NAME,
  BASEMAP_DEFAULT_ACTION_TYPE_CHANGE
} from '../reducers/dashboard'

export function add(payload) {
  return {
    name: BASEMAP_ACTION_NAME,
    type: BASEMAP_ACTION_TYPE_ADD,
    payload: payload
  };
}

export function remove(payload) {
  return {
    name: BASEMAP_ACTION_NAME,
    type: BASEMAP_ACTION_TYPE_REMOVE,
    payload: payload
  };
}

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