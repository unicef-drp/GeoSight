import { REFERENCE_LAYER_ACTION_NAME } from '../reducers'
import { fetching } from "../reducers_api";

export const REQUEST_REFERENCE_LAYER = 'REQUEST/' + REFERENCE_LAYER_ACTION_NAME;
export const RECEIVE_REFERENCE_LAYER = 'RECEIVE/' + REFERENCE_LAYER_ACTION_NAME;

function request() {
  return { type: REQUEST_REFERENCE_LAYER };
}

function receive(data, error = null) {
  return {
    type: RECEIVE_REFERENCE_LAYER,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetch(dispatch) {
  fetching(dispatch, urls.dashboardReferenceLayerData, {}, receive)
  return request();
}

export default {
  fetch
}