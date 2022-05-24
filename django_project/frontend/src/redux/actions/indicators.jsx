import {
  INDICATOR_ACTION_NAME,
  INDICATOR_ACTION_TYPE_ADD,
  INDICATOR_ACTION_TYPE_REMOVE
} from '../reducers/dashboard'
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

export function add(payload) {
  return {
    name: INDICATOR_ACTION_NAME,
    type: INDICATOR_ACTION_TYPE_ADD,
    payload: payload
  };
}

export function remove(payload) {
  return {
    name: INDICATOR_ACTION_NAME,
    type: INDICATOR_ACTION_TYPE_REMOVE,
    payload: payload
  };
}

export default {
  fetch, add, remove
}