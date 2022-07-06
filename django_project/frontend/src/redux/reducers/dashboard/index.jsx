import { combineReducers } from 'redux';

import mapReducer from './map'
import dashboardRequestReducer from './dashboard'
import indicatorDataReducer from "./indicatorsData";
import filtersDataReducer from "./filtersData";
import geometriesReducer from "./geometries";


export default combineReducers({
  map: mapReducer,
  dashboard: dashboardRequestReducer,

  indicatorData: indicatorDataReducer,
  filtersData: filtersDataReducer,
  geometries: geometriesReducer,
});
