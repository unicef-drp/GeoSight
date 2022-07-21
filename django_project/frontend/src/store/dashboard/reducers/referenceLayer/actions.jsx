import {
  REFERENCE_LAYER_ACTION_NAME,
  REFERENCE_LAYER_ACTION_TYPE_UPDATE
} from './index'

export function update(payload) {
  return {
    name: REFERENCE_LAYER_ACTION_NAME,
    type: REFERENCE_LAYER_ACTION_TYPE_UPDATE,
    payload: payload
  };
}

export default {
  fetch, update
}