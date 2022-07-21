import { combineReducers } from 'redux';

import mapReducer from './map'
import dashboardRequestReducer from './dashboard'
import indicatorsDataReducer from "./indicatorsData";
import ReferenceLayerDataReducer from "./referenceLayerData";
import filtersDataReducer from "./filtersData";
import geometriesReducer from "./geometries";
import filteredGeometriesReducer from "./filteredGeometries";


export default combineReducers({
  // Just dashboard data without adding anything in there
  dashboard: dashboardRequestReducer,

  map: mapReducer,
  indicatorsData: indicatorsDataReducer,
  referenceLayerData: ReferenceLayerDataReducer,
  filtersData: filtersDataReducer,
  geometries: geometriesReducer,
  filteredGeometries: filteredGeometriesReducer,
});
