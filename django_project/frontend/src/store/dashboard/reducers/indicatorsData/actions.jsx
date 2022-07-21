import {
  INDICATORS_DATA_ACTION_NAME,
  INDICATORS_DATA_ACTION_TYPE_UPDATE_LEVEL
} from './index'
import { fetchingData } from "../../../../Requests";

/**
 * Requests data.
 * @param {object} id indicator ID.
 * @param {object} payload indicator.
 */
export const REQUEST_INDICATOR = 'REQUEST/' + INDICATORS_DATA_ACTION_NAME;
export const RECEIVE_INDICATOR = 'RECEIVE/' + INDICATORS_DATA_ACTION_NAME;

function request(id) {
  return {
    id: id,
    name: INDICATORS_DATA_ACTION_NAME,
    type: REQUEST_INDICATOR
  };
}

function receive(data, error, id) {
  return {
    id: id,
    name: INDICATORS_DATA_ACTION_NAME,
    type: RECEIVE_INDICATOR,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetch(dispatch, id, url) {
  fetchingData(
    url, {}, {}, function (response, error) {
      dispatch(
        receive(response, error, id)
      )
    }
  )
  return request(id);
}


/**
 * Update level name
 * @param {int} id Id of data.
 * @param {String} reporting_level Reporting level that will be changed.
 */
export function updateLevel(id, reporting_level) {
  return {
    name: INDICATORS_DATA_ACTION_NAME,
    type: INDICATORS_DATA_ACTION_TYPE_UPDATE_LEVEL,
    id: id,
    reporting_level: reporting_level
  };
}

export default {
  updateLevel, fetch
}