import { combineReducers } from 'redux';
import { APIReducer } from './reducers_api';

/**
 * DASHBOARD reducer
 */
export const DASHBOARD_ACTION_NAME = 'DASHBOARD';
const dashboardInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: {}
};

function dashboardReducer(state = dashboardInitialState, action) {
  return APIReducer(state, action, DASHBOARD_ACTION_NAME);
}

/**
 * MAP reducer
 */
export const MAP_CHANGE_BASEMAP = `MAP/CHANGE_BASEMAP`;
export const MAP_ADD_CONTEXTLAYERS = `MAP/ADD_CONTEXTLAYERS`;
export const MAP_REMOVE_CONTEXTLAYERS = `MAP/REMOVE_CONTEXTLAYERS`;
const mapInitialState = {
  basemapLayer: null,
  contextLayers: {},
};

function mapReducer(state = mapInitialState, action) {
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
    default:
      return state
  }
}

export default combineReducers({
  dashboard: dashboardReducer,
  map: mapReducer,
});
