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
export const MAP_CHANGE_BASEMAP = `MAP/BASEMAP_CHANGE`;
const mapInitialState = {
  selectedBasemap: undefined
};

function mapReducer(state = mapInitialState, action) {
  switch (action.type) {
    case MAP_CHANGE_BASEMAP: {
      return {
        ...state,
        selectedBasemap: action.payload
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
