import {
  INDICATOR_ACTION_NAME,
  INDICATOR_ACTION_TYPE_ADD,
  INDICATOR_ACTION_TYPE_FILTER,
  INDICATOR_ACTION_TYPE_REMOVE
} from '../reducers/indicators'
import { fetchingData } from "../../Requests";

export const REQUEST_INDICATOR = 'REQUEST/' + INDICATOR_ACTION_NAME;
export const RECEIVE_INDICATOR = 'RECEIVE/' + INDICATOR_ACTION_NAME;

function request(id) {
  return {
    id: id,
    name: INDICATOR_ACTION_NAME,
    type: REQUEST_INDICATOR
  };
}

function receive(data, error, id) {
  return {
    id: id,
    name: INDICATOR_ACTION_NAME,
    type: RECEIVE_INDICATOR,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetch(dispatch, id, url) {
  fetchingData(
    url, {}, function (response, error) {
      dispatch(
        receive(response, error, id)
      )
    }
  )
  return request(id);
}


/**
 * Add new indicator data.
 * @param {object} payload New indicator data.
 */
export function add(payload) {
  return {
    name: INDICATOR_ACTION_NAME,
    type: INDICATOR_ACTION_TYPE_ADD,
    payload: payload
  };
}


/**
 * Remove indicator.
 * @param {object} payload Indicator indicator.
 */
export function remove(payload) {
  return {
    name: INDICATOR_ACTION_NAME,
    type: INDICATOR_ACTION_TYPE_REMOVE,
    payload: payload
  };
}


/**
 * Filter indicators.
 * It will use filters data and filter the indicators data.
 */
export function filter() {
  return {
    name: INDICATOR_ACTION_NAME,
    type: INDICATOR_ACTION_TYPE_FILTER
  };
}

export default {
  fetch, add, remove, filter
}