import {
  FILTERS_QUERY_ACTION_NAME,
  FILTERS_QUERY_ACTION_UPDATE
} from '../reducers/filtersQuery';

/**
 * Change data of filter.
 * @param {object} payload Filter data.
 */
export function update(payload) {
  return {
    name: FILTERS_QUERY_ACTION_NAME,
    type: FILTERS_QUERY_ACTION_UPDATE,
    payload: payload
  };
}


export default {
  update
}