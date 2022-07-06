import {
  INDICATOR_DATA_ACTION_DATA_UPDATE,
  INDICATOR_DATA_ACTION_NAME,
  INDICATOR_DATA_ACTION_TYPE_FILTER
} from '../../reducers/dashboard/indicatorsData'

/**
 * Update indicator data.
 * @param {object} payload Indicator indicator.
 */
export function update(payload) {
  return {
    name: INDICATOR_DATA_ACTION_NAME,
    type: INDICATOR_DATA_ACTION_DATA_UPDATE,
    payload: payload
  };
}


/**
 * Filter indicators.
 * It will use filters data and filter the indicators data.
 */
export function filter(query) {
  return {
    name: INDICATOR_DATA_ACTION_NAME,
    type: INDICATOR_DATA_ACTION_TYPE_FILTER,
    query: query
  };
}

export default {
  update, filter
}