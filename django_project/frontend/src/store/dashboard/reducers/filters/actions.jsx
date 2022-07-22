import { FILTERS_ACTION_NAME, FILTERS_ACTION_TYPE_UPDATE, } from './index'


/**
 * Update filters data.
 * @param {object} payload filters data.
 */
export function update(payload) {
  return {
    name: FILTERS_ACTION_NAME,
    type: FILTERS_ACTION_TYPE_UPDATE,
    payload: payload
  };
}


export default {
  update
}