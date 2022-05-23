import { fetching } from "../reducers_api";

import {
  REFERENCE_LAYER_ACTION_NAME,
  REFERENCE_LAYER_ACTION_TYPE_CHANGE
} from '../reducers/dashboard'

const REQUEST_REFERENCE_LAYER = 'REQUEST/' + REFERENCE_LAYER_ACTION_NAME;
const RECEIVE_REFERENCE_LAYER = 'RECEIVE/' + REFERENCE_LAYER_ACTION_NAME;

function request() {
  return {
    name: REFERENCE_LAYER_ACTION_NAME,
    type: REQUEST_REFERENCE_LAYER
  };
}

function receive(data, error = null) {
  return {
    name: REFERENCE_LAYER_ACTION_NAME,
    type: RECEIVE_REFERENCE_LAYER,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetch(dispatch, url) {
  fetching(dispatch, url, {}, receive)
  return request();
}

export function change(payload) {
  return {
    name: REFERENCE_LAYER_ACTION_NAME,
    type: REFERENCE_LAYER_ACTION_TYPE_CHANGE,
    payload: payload
  };
}

export default {
  fetch,
  change
}