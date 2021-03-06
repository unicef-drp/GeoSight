import {
  CONTEXT_LAYER_ACTION_NAME,
  CONTEXT_LAYER_ACTION_TYPE_ADD,
  CONTEXT_LAYER_ACTION_TYPE_REMOVE,
  CONTEXT_LAYER_ACTION_TYPE_UPDATE,
  CONTEXT_LAYER_ACTION_TYPE_REARRANGE
} from './index'


/**
 * Add new context layer.
 * @param {object} payload New context layer data.
 */
export function add(payload) {
  return {
    name: CONTEXT_LAYER_ACTION_NAME,
    type: CONTEXT_LAYER_ACTION_TYPE_ADD,
    payload: payload
  };
}

/**
 * Remove context layer.
 * @param {object} payload Context layer data.
 */
export function remove(payload) {
  return {
    name: CONTEXT_LAYER_ACTION_NAME,
    type: CONTEXT_LAYER_ACTION_TYPE_REMOVE,
    payload: payload
  };
}

/**
 * Update context layer.
 * @param {object} payload Context layer data.
 */
export function update(payload) {
  return {
    name: CONTEXT_LAYER_ACTION_NAME,
    type: CONTEXT_LAYER_ACTION_TYPE_UPDATE,
    payload: payload
  };
}
/**
 * Rearrange context layer.
 * @param {object} payload Context layer data.
 */
export function rearrange(payload) {
  return {
    name: CONTEXT_LAYER_ACTION_NAME,
    type: CONTEXT_LAYER_ACTION_TYPE_REARRANGE,
    payload: payload
  };
}

export default {
  add, remove, update, rearrange
}