/**
 * FILTERS reducer
 */

export const FILTERS_QUERY_ACTION_NAME = 'FILTERS_QUERY';
export const FILTERS_QUERY_ACTION_UPDATE = 'FILTERS_QUERY/UPDATE';

const initialState = null
export default function filtersDataReducer(state = initialState, action) {
  if (action.name === FILTERS_QUERY_ACTION_NAME) {
    switch (action.type) {
      case FILTERS_QUERY_ACTION_UPDATE:
        if (action.payload) {
          return {...action.payload}
        }
        break;
      default:
        return state
    }
  }
  return state
}