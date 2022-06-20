import { combineReducers } from 'redux';

import mapReducer from './reducers/map'
import dashboardRequestReducer from './reducers/dashboard'
import indicatorDataReducer from "./reducers/indicatorsData";
import filtersDataReducer from "./reducers/filtersData";


export default combineReducers({
  map: mapReducer,
  dashboard: dashboardRequestReducer,

  indicatorData: indicatorDataReducer,
  filtersData: filtersDataReducer,
});
