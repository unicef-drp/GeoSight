import { REFERENCE_LAYER_DATA_ACTION_NAME } from './index'
import { fetchingData } from "../../../../Requests";

const REQUEST_REFERENCE_LAYER_DATA = 'REQUEST/' + REFERENCE_LAYER_DATA_ACTION_NAME;
const RECEIVE_REFERENCE_LAYER_DATA = 'RECEIVE/' + REFERENCE_LAYER_DATA_ACTION_NAME;

function request(id) {
  return {
    id: id,
    name: REFERENCE_LAYER_DATA_ACTION_NAME,
    type: REQUEST_REFERENCE_LAYER_DATA
  };
}

function receive(data, error, id) {
  return {
    id: id,
    name: REFERENCE_LAYER_DATA_ACTION_NAME,
    type: RECEIVE_REFERENCE_LAYER_DATA,
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

export default { fetch }