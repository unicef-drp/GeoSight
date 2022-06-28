import {
  GEOMETRIES_ACTION_NAME,
  GEOMETRIES_ACTION_TYPE_ADD
} from '../reducers/geometries';

/**
 * Change data of filter.
 * @param {object} key Key data.
 * @param {object} value Value data.
 */
export function add(key, value) {
  return {
    name: GEOMETRIES_ACTION_NAME,
    type: GEOMETRIES_ACTION_TYPE_ADD,
    key: key,
    value: value
  };
}


export default {
  add
}