import { combineReducers } from 'redux';

import mapReducer from './reducers/map'
import dashboardRequestReducer from './reducers/dashboard'
import referenceLayerReducer from './reducers/referenceLayer'
import indicatorsReducer from './reducers/indicators'
import {
  indicatorRequestReducer,
  referenceLayerRequestReducer
} from "./reducers/requests";

export {
  DASHBOARD_ACTION_NAME,
  REFERENCE_LAYER_ACTION_NAME,
  INDICATOR_ACTION_NAME
} from './reducers/requests';

export {
  MAP_CHANGE_BASEMAP,
  MAP_REFERENCE_LAYER_CHANGED,
  MAP_ADD_CONTEXTLAYERS, MAP_REMOVE_CONTEXTLAYERS,
} from './reducers/map';

export default combineReducers({
  map: mapReducer,
  referenceLayer: referenceLayerReducer,
  indicators: indicatorsReducer,

  // Requests
  dashboard: dashboardRequestReducer,
  indicatorRequest: indicatorRequestReducer,
  referenceLayerRequest: referenceLayerRequestReducer,
});
