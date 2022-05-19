import { APIReducer } from '../reducers_api';

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

export default function dashboardReducer(state = dashboardInitialState, action) {
  return APIReducer(state, action, DASHBOARD_ACTION_NAME);
}