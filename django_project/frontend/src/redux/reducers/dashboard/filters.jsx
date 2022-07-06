/**
 * FILTERS reducer
 */

export const FILTERS_ACTION_NAME = 'FILTERS';
export const FILTERS_ACTION_UPDATE = 'FILTERS/UPDATE';

const initialState = []
export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case FILTERS_ACTION_UPDATE: {
      const { payload } = action;
      return payload
    }
    default:
      return state
  }
}