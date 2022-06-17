import {
  FILTERS_ACTION_NAME,
  FILTERS_ACTION_UPDATE
} from '../reducers/filters';

/**
 * Change data of filter.
 * @param {object} payload Filter data.
 */
export function update(payload) {
  return {
    name: FILTERS_ACTION_NAME,
    type: FILTERS_ACTION_UPDATE,
    payload: payload
  };
}


export default {
  update
}