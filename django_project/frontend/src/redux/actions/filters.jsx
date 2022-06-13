import {
  FILTERS_ACTION_CHANGE_STATUS,
  FILTERS_ACTION_NAME,
  FILTERS_ACTION_UPDATE
} from '../reducers/filters';

/**
 * Change state of filter.
 * @param {int} id ID of filter.
 * @param {boolean} checked Filter data.
 */
export function changeState(id, checked) {
  return {
    name: FILTERS_ACTION_NAME,
    type: FILTERS_ACTION_CHANGE_STATUS,
    id: id,
    payload: checked
  };
}

/**
 * Change data of filter.
 * @param {int} id ID of filter.
 * @param {object} payload Filter data.
 */
export function update(id, payload) {
  return {
    name: FILTERS_ACTION_NAME,
    type: FILTERS_ACTION_UPDATE,
    id: id,
    payload: payload
  };
}


export default {
  changeState, update
}