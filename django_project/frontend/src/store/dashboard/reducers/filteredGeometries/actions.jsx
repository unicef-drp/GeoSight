import {
  FILTERED_GEOMETRIES_ACTION_NAME,
  FILTERED_GEOMETRIES_ACTION_TYPE_UPDATE
} from './index';

/**
 * Update filtered geometries.
 * @param {object} payload Filtered Geometries.
 */
export function update(payload) {
  return {
    name: FILTERED_GEOMETRIES_ACTION_NAME,
    type: FILTERED_GEOMETRIES_ACTION_TYPE_UPDATE,
    payload: payload
  };
}


export default {
  update
}