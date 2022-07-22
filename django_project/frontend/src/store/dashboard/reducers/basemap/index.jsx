/**
 * WIDGETS reducer
 */


export const BASEMAP_ACTION_NAME = 'BASEMAP';
export const BASEMAP_ACTION_TYPE_ADD = 'BASEMAP/ADD';
export const BASEMAP_ACTION_TYPE_UPDATE = 'BASEMAP/UPDATE';
export const BASEMAP_ACTION_TYPE_REMOVE = 'BASEMAP/REMOVE';
export const BASEMAP_ACTION_TYPE_REARRANGE = 'BASEMAP/REARRANGE';

const initialState = []
export default function basemapsReducer(state = initialState, action) {
  if (action.name === BASEMAP_ACTION_NAME) {
    switch (action.type) {
      case BASEMAP_ACTION_TYPE_ADD: {
        if (state.length === 0) {
          action.payload.visible_by_default = true
        }
        return [
          ...state,
          action.payload
        ]
      }
      case BASEMAP_ACTION_TYPE_REMOVE: {
        const basemapLayers = []
        let noVisiblePayload = action.payload.visible_by_default;
        state.forEach(function (basemapLayer) {
          if (basemapLayer.id !== action.payload.id) {
            if (noVisiblePayload) {
              basemapLayer.visible_by_default = true
              noVisiblePayload = false;
            }
            basemapLayers.push(basemapLayer)
          }
        })
        return basemapLayers
      }
      case BASEMAP_ACTION_TYPE_UPDATE: {
        const basemapLayers = []
        state.forEach(function (basemapLayer) {
          if (basemapLayer.id === action.payload.id) {
            basemapLayers.push(action.payload)
          } else {
            if (action.payload.visible_by_default) {
              basemapLayer.visible_by_default = false
            }
            basemapLayers.push(basemapLayer)
          }
        })
        return basemapLayers
      }
      case BASEMAP_ACTION_TYPE_REARRANGE: {
        const basemapLayers = []
        let order = 0
        for (const [groupName, groupValue] of Object.entries(action.payload)) {
          groupValue.map(id => {
            const layer = state.filter(layerState => {
              return layerState.id === id
            })[0]
            if (layer) {
              layer.order = order
              layer.group = groupName
              basemapLayers.push(layer)
              order += 1;
            }
          })
        }
        return basemapLayers
      }
      default:
        return state
    }
  }
}