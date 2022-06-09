import {
  FILTERS_ACTION_CHANGE_STATUS,
  FILTERS_ACTION_NAME
} from '../reducers/filters'

/**
 * Change state of filter
 * @param {object} filterId ID of filter.
 * @param {object} checked Filter data.
 */
export function changeState(filterId, checked) {
  return {
    name: FILTERS_ACTION_NAME,
    type: FILTERS_ACTION_CHANGE_STATUS,
    payload: {
      filterId: filterId,
      checked: checked
    }
  };
}

export default {
  changeState
}