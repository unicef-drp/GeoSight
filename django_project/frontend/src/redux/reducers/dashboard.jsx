/**
 * DASHBOARD REQUEST reducer
 */
import { APIReducer } from '../reducers_api';

export const DASHBOARD_ACTION_NAME = 'DASHBOARD';

const dashboardInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: {}
};

export default function dashboardRequestReducer(
  state = dashboardInitialState, action
) {
  return APIReducer(state, action, DASHBOARD_ACTION_NAME)
}