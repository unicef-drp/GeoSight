import {
  CONTEXT_LAYER_ACTION_NAME,
  CONTEXT_LAYER_ACTION_TYPE_ADD,
  CONTEXT_LAYER_ACTION_TYPE_REMOVE
} from '../reducers/dashboard'

export function add(payload) {
  return {
    name: CONTEXT_LAYER_ACTION_NAME,
    type: CONTEXT_LAYER_ACTION_TYPE_ADD,
    payload: payload
  };
}

export function remove(payload) {
  return {
    name: CONTEXT_LAYER_ACTION_NAME,
    type: CONTEXT_LAYER_ACTION_TYPE_REMOVE,
    payload: payload
  };
}

export default {
  add, remove
}