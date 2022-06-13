/**
 * FILTERS reducer
 */

export const FILTERS_ACTION_NAME = 'FILTERS';
export const FILTERS_ACTION_CHANGE_STATUS = 'FILTERS/CHANGE_STATUS';
export const FILTERS_ACTION_UPDATE = 'FILTERS/UPDATE';

const initialState = []
export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case FILTERS_ACTION_CHANGE_STATUS: {
      const { id, payload } = action;
      const newState = [...state]
      newState[id].checked = payload
      return newState
    }
    case FILTERS_ACTION_UPDATE: {
      const { id, payload } = action;
      const newState = [...state]
      newState[id] = payload
      return newState
    }
    default:
      return state
  }
}