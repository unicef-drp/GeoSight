import { DASHBOARD_ACTION_NAME } from '../reducers'
import { fetching } from "../reducers_api";

export const REQUEST_DASHBOARD = 'REQUEST_' + DASHBOARD_ACTION_NAME;
export const RECEIVE_DASHBOARD = 'RECEIVE_' + DASHBOARD_ACTION_NAME;

function request() {
  return { type: REQUEST_DASHBOARD };
}

function receive(data, error = null) {
  return {
    type: RECEIVE_DASHBOARD,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetch(dispatch) {
  fetching(dispatch, urls.dashboardData, {}, receive)
  return request();
}

export default {
  fetch
}