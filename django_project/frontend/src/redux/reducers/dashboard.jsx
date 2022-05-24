import { APIReducer } from '../reducers_api';

/**
 * DASHBOARD REQUEST reducer
 */
export const DASHBOARD_ACTION_NAME = 'DASHBOARD';
export const REFERENCE_LAYER_ACTION_NAME = 'REFERENCE_LAYER';
export const REFERENCE_LAYER_ACTION_TYPE_CHANGE = 'REFERENCE_LAYER/CHANGE';

export const INDICATOR_ACTION_NAME = 'INDICATOR';
export const INDICATOR_ACTION_TYPE_ADD = 'INDICATOR/ADD';
export const INDICATOR_ACTION_TYPE_REMOVE = 'INDICATOR/REMOVE';

export const BASEMAP_ACTION_NAME = 'BASEMAP';
export const BASEMAP_ACTION_TYPE_ADD = 'BASEMAP/ADD';
export const BASEMAP_ACTION_TYPE_REMOVE = 'BASEMAP/REMOVE';

export const BASEMAP_DEFAULT_ACTION_NAME = 'BASEMAP_DEFAULT';
export const BASEMAP_DEFAULT_ACTION_TYPE_CHANGE = 'BASEMAP_DEFAULT/CHANGE'

export const EXTENT_DEFAULT_ACTION_NAME = 'EXTENT';
export const EXTENT_DEFAULT_ACTION_TYPE_CHANGE = 'EXTENT/CHANGE'

export const CONTEXT_LAYER_ACTION_NAME = 'CONTEXT_LAYER';
export const CONTEXT_LAYER_ACTION_TYPE_ADD = 'CONTEXT_LAYER/ADD';
export const CONTEXT_LAYER_ACTION_TYPE_REMOVE = 'CONTEXT_LAYER/REMOVE';

const dashboardInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: {}
};

export default function dashboardReducer(
  state = dashboardInitialState, action
) {
  switch (action.name) {
    // DASHBOARD DATA
    case DASHBOARD_ACTION_NAME: {
      return APIReducer(state, action, DASHBOARD_ACTION_NAME)
    }

    // BASEMAP DEFAULT REDUCER
    case BASEMAP_DEFAULT_ACTION_NAME: {
      const newState = { ...state }
      newState.data = {
        ...newState.data,
        defaultBasemapLayer: action.payload
      }
      return newState
    }

    // EXTENT DEFAULT REDUCER
    case EXTENT_DEFAULT_ACTION_NAME: {
      const newState = { ...state }
      newState.data = {
        ...newState.data,
        extent: action.payload
      }
      return newState
    }

    // BASEMAP REDUCER
    case BASEMAP_ACTION_NAME: {
      switch (action.type) {
        case BASEMAP_ACTION_TYPE_ADD: {
          const newState = { ...state }
          newState.data = {
            ...newState.data,
            basemapsLayers: [
              ...newState.data.basemapsLayers,
              action.payload
            ]
          }
          return newState
        }
        case BASEMAP_ACTION_TYPE_REMOVE: {
          const newState = { ...state }
          const basemapLayers = []
          newState.data.basemapsLayers.forEach(function (basemapLayer) {
            if (basemapLayer.id !== action.payload.id) {
              basemapLayers.push(basemapLayer)
            }
          })
          newState.data = {
            ...newState.data,
            basemapsLayers: basemapLayers
          }
          return newState
        }
        default:
          return state
      }
    }

    // REFERENCE LAYER REDUCER
    case REFERENCE_LAYER_ACTION_NAME: {
      switch (action.type) {
        case REFERENCE_LAYER_ACTION_TYPE_CHANGE: {
          const newState = { ...state }
          newState.data = {
            ...newState.data,
            referenceLayer: action.payload
          }
          return newState
        }
        default: {
          const data = APIReducer(state, action, REFERENCE_LAYER_ACTION_NAME)
          const newState = { ...state }
          newState.data.referenceLayer = {
            ...newState.data.referenceLayer,
            ...data
          }
          return newState
        }
      }
    }

    // CONTEXT LAYERS REDUCER
    case CONTEXT_LAYER_ACTION_NAME: {
      switch (action.type) {
        case CONTEXT_LAYER_ACTION_TYPE_ADD: {
          const newState = { ...state }
          newState.data = {
            ...newState.data,
            contextLayers: [
              ...newState.data.contextLayers,
              action.payload
            ]
          }
          return newState
        }
        case CONTEXT_LAYER_ACTION_TYPE_REMOVE: {
          const newState = { ...state }
          const contextLayers = []
          newState.data.contextLayers.forEach(function (contextLayer) {
            if (contextLayer.id !== action.payload.id) {
              contextLayers.push(contextLayer)
            }
          })
          newState.data = {
            ...newState.data,
            contextLayers: contextLayers
          }
          return newState
        }
        default:
          return state
      }
    }

    // INDICATOR REDUCER
    case INDICATOR_ACTION_NAME: {
      switch (action.type) {
        case INDICATOR_ACTION_TYPE_ADD: {
          const newState = { ...state }
          newState.data = {
            ...newState.data,
            indicators: [
              ...newState.data.indicators,
              action.payload
            ]
          }
          return newState
        }
        case INDICATOR_ACTION_TYPE_REMOVE: {
          const newState = { ...state }
          const indicators = []
          newState.data.indicators.forEach(function (indicator) {
            if (indicator.id !== action.payload.id) {
              indicators.push(indicator)
            }
          })
          newState.data = {
            ...newState.data,
            indicators: indicators
          }
          return newState
        }
        default:
          const data = APIReducer(state, action, INDICATOR_ACTION_NAME)
          if (state.data.indicators[action.id]
            && state.data.referenceLayer.data
            && state.data.referenceLayer.data.features) {
            const geoms = {};
            state.data.referenceLayer.data.features.forEach(function (feature) {
              geoms[feature.properties.identifier] = feature.properties;
            })
            const newData = [];
            data.data.forEach(function (row) {
              if (geoms[row.geometry_code]) {
                newData.push({
                  ...row,
                  ...geoms[row.geometry_code]
                })
              }
            })
            data.data = newData;
            const newState = { ...state }
            newState.data.indicators[action.id] = {
              ...newState.data.indicators[action.id],
              ...data
            }
            return newState
          }
          return state
      }
    }
    default:
      return state
  }
}