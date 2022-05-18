import { combineReducers } from 'redux';
import dashboardReducer from './reducers/dashboard'
import mapReducer from './reducers/map'
import referenceLayerReducer from './reducers/referenceLayer'

export { DASHBOARD_ACTION_NAME } from './reducers/dashboard';
export {
  MAP_CHANGE_BASEMAP, MAP_ADD_CONTEXTLAYERS, MAP_REMOVE_CONTEXTLAYERS,
  REFERENCE_LAYER_CHANGED
} from './reducers/map';
export { REFERENCE_LAYER_ACTION_NAME } from './reducers/referenceLayer';

export default combineReducers({
  dashboard: dashboardReducer,
  map: mapReducer,
  referenceLayerJson: referenceLayerReducer,
});
