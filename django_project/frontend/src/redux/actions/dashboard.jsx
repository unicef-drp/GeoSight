import { fetchingData } from "../../Requests";

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
  fetchingData(
    urls.dashboardData, {}, function (response, error) {
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