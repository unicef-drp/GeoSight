/**
 * WIDGETS reducer
 */

export const CONTEXT_LAYER_ACTION_NAME = 'CONTEXT_LAYER';
export const CONTEXT_LAYER_ACTION_TYPE_ADD = 'CONTEXT_LAYER/ADD';
export const CONTEXT_LAYER_ACTION_TYPE_REMOVE = 'CONTEXT_LAYER/REMOVE';
export const CONTEXT_LAYER_ACTION_TYPE_UPDATE = 'CONTEXT_LAYER/UPDATE';
export const CONTEXT_LAYER_ACTION_TYPE_REARRANGE = 'CONTEXT_LAYER/REARRANGE';

const initialState = []
export default function contextLayersReducer(state = initialState, action) {
  if (action.name === CONTEXT_LAYER_ACTION_NAME) {
    switch (action.type) {
      case CONTEXT_LAYER_ACTION_TYPE_ADD: {
        return [
          ...state,
          action.payload
        ]
      }
      case CONTEXT_LAYER_ACTION_TYPE_REMOVE: {
        const contextLayers = []
        state.forEach(function (contextLayer) {
          if (contextLayer.id !== action.payload.id) {
            contextLayers.push(contextLayer)
          }
        })
        return contextLayers
      }
      case CONTEXT_LAYER_ACTION_TYPE_UPDATE: {
        const contextLayers = []
        state.forEach(function (contextLayer) {
          if (contextLayer.id === action.payload.id) {
            contextLayers.push(action.payload)
          } else {
            contextLayers.push(contextLayer)
          }
        })
        return contextLayers
      }

      case CONTEXT_LAYER_ACTION_TYPE_REARRANGE: {
        const contextLayers = []
        let order = 0
        for (const [groupName, groupValue] of Object.entries(action.payload)) {
          groupValue.map(id => {
            const layer = state.filter(layerState => {
              return layerState.id === id
            })[0]
            layer.order = order
            layer.group = groupName
            contextLayers.push(layer)
            order += 1;
          })
        }
        return contextLayers
      }
      default:
        return state
    }
  }
}