import {
  MAP_ADD_CONTEXTLAYERS,
  MAP_CHANGE_BASEMAP,
  MAP_REFERENCE_LAYER_CHANGED,
  MAP_REMOVE_CONTEXTLAYERS,
  MAP_REMOVE_CONTEXTLAYERS_ALL
} from '../map'


/**
 * Change basemap.
 * @param {object} payload Basemap data.
 */
function change_basemap(payload) {
  return {
    type: MAP_CHANGE_BASEMAP,
    payload: payload
  };
}

/**
 * Change reference layer.
 * @param {object} payload Reference layer data.
 */
function change_reference_layer(payload) {
  return {
    type: MAP_REFERENCE_LAYER_CHANGED,
    payload: payload
  };
}

/**
 * Add context layer.
 * @param {int} id ID of Context Layer.
 * @param {object} payload Context Layer data.
 */
function add_context_layer(id, payload) {
  return {
    type: MAP_ADD_CONTEXTLAYERS,
    id: id,
    payload: payload,
  };
}

/**
 * Remove context layer.
 * @param {int} id ID of Context Layer.
 */
function remove_context_layer(id) {
  return {
    type: MAP_REMOVE_CONTEXTLAYERS,
    id: id
  };
}

/**
 * Remove all context layer.
 */
function remove_all_context_layer() {
  return {
    type: MAP_REMOVE_CONTEXTLAYERS_ALL,
    id: id
  };
}

export default {
  change_basemap,
  add_context_layer,
  remove_context_layer,
  change_reference_layer,
  remove_all_context_layer
}