import { combineReducers } from 'redux';

import mapReducer from './reducers/map'
import dashboardReducer from "./reducers/dashboard";

export {
  DASHBOARD_ACTION_NAME,
  REFERENCE_LAYER_ACTION_NAME,
  INDICATOR_ACTION_NAME
} from './reducers/dashboard';
export {
  MAP_CHANGE_BASEMAP,
  MAP_REFERENCE_LAYER_CHANGED,
  MAP_ADD_CONTEXTLAYERS, MAP_REMOVE_CONTEXTLAYERS,
} from './reducers/map';

export default combineReducers({
  map: mapReducer,
  dashboard: dashboardReducer,
});
