/**
 * WIDGETS reducer
 */

export const WIDGET_ACTION_NAME = 'WIDGET';
export const WIDGET_ACTION_TYPE_ADD = 'WIDGET/ADD';
export const WIDGET_ACTION_TYPE_REMOVE = 'WIDGET/REMOVE';
export const WIDGET_ACTION_TYPE_UPDATE = 'WIDGET/UPDATE';
export const WIDGET_ACTION_TYPE_REARRANGE = 'WIDGET/REARRANGE';

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
    case WIDGET_ACTION_TYPE_REARRANGE: {
      const newState = []
      let order = 0
      for (const [groupName, groupValue] of Object.entries(action.payload)) {
        groupValue.map(id => {
          const layer = state.filter(layerState => {
            return layerState.id === id
          })[0]
          if (layer) {
            layer.order = order
            layer.group = groupName
            newState.push(layer)
            order += 1;
          }
        })
      }
      return newState
    }
    default:
      return state
  }
}