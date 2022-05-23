import { combineReducers } from 'redux';

import mapReducer from './reducers/map'
import dashboardRequestReducer from './reducers/dashboard'


export default combineReducers({
  map: mapReducer,
  dashboard: dashboardRequestReducer
});
