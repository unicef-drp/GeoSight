import { combineReducers } from 'redux';

import mapReducer from './reducers/dashboard/map'
import dashboardRequestReducer from './reducers/dashboard/dashboard'
import indicatorDataReducer from "./reducers/dashboard/indicatorsData";
import filtersDataReducer from "./reducers/dashboard/filtersData";
import geometriesReducer from "./reducers/dashboard/geometries";


export default combineReducers({
  map: mapReducer,
  dashboard: dashboardRequestReducer,

  indicatorData: indicatorDataReducer,
  filtersData: filtersDataReducer,
  geometries: geometriesReducer,
});
