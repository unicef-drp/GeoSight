import { fetchingData } from "../../../../Requests";

import { DASHBOARD_ACTION_NAME } from './index'

const REQUEST_DASHBOARD = 'REQUEST/' + DASHBOARD_ACTION_NAME;
const RECEIVE_DASHBOARD = 'RECEIVE/' + DASHBOARD_ACTION_NAME;


/**
 * Request dashboard data.
 */
function request() {
  return {
    name: DASHBOARD_ACTION_NAME,
    type: REQUEST_DASHBOARD
  };
}

/**
 * Receive response dashboard data.
 */
function receive(data, error = null) {
  return {
    name: DASHBOARD_ACTION_NAME,
    type: RECEIVE_DASHBOARD,
    data,
    error,
    receivedAt: Date.now()
  };
}

/**
 * Fetching dashboard data.
 */
export function fetch(dispatch) {
  fetchingData(
    urls.dashboardData, {}, {}, function (response, error) {
      dispatch(
        receive(response, error)
      )
    }
  )
  return request();
}

export default {
  fetch
}