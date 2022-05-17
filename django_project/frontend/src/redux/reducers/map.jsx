/**
 * MAP reducer
 */
export const MAP_CHANGE_BASEMAP = `MAP/CHANGE_BASEMAP`;
export const MAP_ADD_CONTEXTLAYERS = `MAP/ADD_CONTEXTLAYERS`;
export const MAP_REMOVE_CONTEXTLAYERS = `MAP/REMOVE_CONTEXTLAYERS`;
export const REFERENCE_LAYER_CHANGED = `MAP/REFERENCE_LAYER_CHANGED`;
const mapInitialState = {
  referenceLayer: null,
  basemapLayer: null,
  contextLayers: {},
};

export default function mapReducer(state = mapInitialState, action) {
  switch (action.type) {
    case MAP_CHANGE_BASEMAP: {
      return {
        ...state,
        basemapLayer: action.payload
      }
    }
    case MAP_ADD_CONTEXTLAYERS: {
      const contextLayers = Object.assign({}, state.contextLayers);
      contextLayers[action.id] = action.payload
      return {
        ...state,
        contextLayers: contextLayers
      }
    }
    case MAP_REMOVE_CONTEXTLAYERS: {
      const contextLayers = Object.assign({}, state.contextLayers);
      delete contextLayers[action.id]
      return {
        ...state,
        contextLayers: contextLayers
      }
    }
    case REFERENCE_LAYER_CHANGED: {
      return {
        ...state,
        referenceLayer: action.payload
      }
    }
    default:
      return state
  }
}
