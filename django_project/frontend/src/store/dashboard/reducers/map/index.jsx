/** MAP reducer */

export const MAP_CHANGE_BASEMAP = `MAP/CHANGE_BASEMAP`;
export const MAP_REFERENCE_LAYER_CHANGED = `MAP/REFERENCE_LAYER_CHANGED`;
export const MAP_ADD_CONTEXTLAYERS = `MAP/ADD_CONTEXTLAYERS`;
export const MAP_REMOVE_CONTEXTLAYERS = `MAP/REMOVE_CONTEXTLAYERS`;
export const MAP_REMOVE_CONTEXTLAYERS_ALL = `MAP/REMOVE_CONTEXTLAYERS_ALL`;

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
      contextLayers[action.id] = {
        'render': true,
        'layer': action.payload
      }
      return {
        ...state,
        contextLayers: contextLayers
      }
    }
    case MAP_REMOVE_CONTEXTLAYERS: {
      const contextLayers = Object.assign({}, state.contextLayers);
      if (contextLayers[action.id]) {
        delete contextLayers[action.id]
      }
      return {
        ...state,
        contextLayers: contextLayers
      }
    }
    case MAP_REMOVE_CONTEXTLAYERS_ALL: {
      return {
        ...state,
        contextLayers: {}
      }
    }
    case MAP_REFERENCE_LAYER_CHANGED: {
      return {
        ...state,
        referenceLayer: action.payload
      }
    }
    default:
      return state
  }
}
