import { fetching } from "../reducers_api";

import {
  INDICATOR_ACTION_NAME,
  INDICATOR_ACTION_TYPE_INIT_DATA
} from '../reducers/indicators'

export const REQUEST_INDICATOR = 'REQUEST/' + INDICATOR_ACTION_NAME;
export const RECEIVE_INDICATOR = 'RECEIVE/' + INDICATOR_ACTION_NAME;

function request(id) {
  return {
    id: id,
    name: INDICATOR_ACTION_NAME,
    type: REQUEST_INDICATOR
  };
}

function receive(data, error, id, referenceLayer) {
  return {
    id: id,
    name: INDICATOR_ACTION_NAME,
    type: RECEIVE_INDICATOR,
    data,
    error,
    receivedAt: Date.now(),
    referenceLayer: referenceLayer
  };
}

export function fetch(dispatch, id, url, referenceLayer) {
  fetching(dispatch, url, {}, receive, id, referenceLayer)
  return request(id);
}

function initData(payload) {
  return {
    name: INDICATOR_ACTION_NAME,
    type: INDICATOR_ACTION_TYPE_INIT_DATA,
    payload: payload,
  };
}

export default {
  fetch,
  initData
}