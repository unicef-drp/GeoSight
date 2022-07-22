/**
 * WIDGETS reducer
 */


export const FILTERS_ACTION_NAME = 'FILTERS';
export const FILTERS_ACTION_TYPE_UPDATE = 'FILTERS/UPDATE';

const initialState = []
export default function filtersReducer(state = initialState, action) {
  if (action.name === FILTERS_ACTION_NAME) {
    switch (action.type) {
      case FILTERS_ACTION_TYPE_UPDATE: {
        return { ...action.payload }
      }
      default:
        return state
    }
  }
}