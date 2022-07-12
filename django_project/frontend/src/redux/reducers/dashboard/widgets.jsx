/**
 * WIDGETS reducer
 */

export const WIDGET_ACTION_NAME = 'WIDGET';
export const WIDGET_ACTION_TYPE_ADD = 'WIDGET/ADD';
export const WIDGET_ACTION_TYPE_REMOVE = 'WIDGET/REMOVE';
export const WIDGET_ACTION_TYPE_UPDATE = 'WIDGET/UPDATE';

const initialState = []
export default function widgetsReducer(state = initialState, action) {
  switch (action.type) {
    case WIDGET_ACTION_TYPE_ADD: {
      return [
        ...state,
        action.payload
      ]
    }
    case WIDGET_ACTION_TYPE_REMOVE: {
      const newState = []
      state.forEach(function (widget) {
        if (widget.id !== action.payload.id) {
          newState.push(widget)
        }
      })
      return newState
    }
    case WIDGET_ACTION_TYPE_UPDATE: {
      const newState = []
      state.forEach(function (widget) {
        if (widget.id === action.payload.id) {
          newState.push(action.payload)
        } else if (widget.id !== action.payload.id) {
          newState.push(widget)
        }
      })
      return newState
    }
    default:
      return state
  }
}