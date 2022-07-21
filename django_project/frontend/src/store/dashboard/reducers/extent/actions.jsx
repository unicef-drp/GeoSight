import {
  EXTENT_DEFAULT_ACTION_NAME,
  EXTENT_DEFAULT_ACTION_TYPE_CHANGE
} from './index'


/**
 * Change default of extent.
 * @param {object} payload New extent data.
 */
export function changeDefault(payload) {
  return {
    name: EXTENT_DEFAULT_ACTION_NAME,
    type: EXTENT_DEFAULT_ACTION_TYPE_CHANGE,
    payload: payload
  };
}

export default {
  changeDefault
}