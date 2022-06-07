/**
 * FILTERS reducer
 */

export const FILTERS_ACTION_NAME = 'FILTERS';
export const FILTERS_ACTION_CHANGE_STATUS = 'FILTERS/CHANGE';

const initialState = []
export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case FILTERS_ACTION_CHANGE_STATUS: {
      const { groupId, filterId, checked } = action.payload;
      const newState = [...state]
      newState[groupId].options[filterId].checked = checked
      return newState
    }
    default:
      return state
  }
}