import { fetching } from "../reducers_api";

import { DASHBOARD_ACTION_NAME } from '../reducers/dashboard'

const REQUEST_DASHBOARD = 'REQUEST/' + DASHBOARD_ACTION_NAME;
const RECEIVE_DASHBOARD = 'RECEIVE/' + DASHBOARD_ACTION_NAME;

function request() {
  return {
    name: DASHBOARD_ACTION_NAME,
    type: REQUEST_DASHBOARD
  };
}

function receive(data, error = null) {
  return {
    name: DASHBOARD_ACTION_NAME,
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