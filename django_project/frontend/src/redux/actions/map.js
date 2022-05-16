import {
  MAP_ADD_CONTEXTLAYERS,
  MAP_CHANGE_BASEMAP,
  MAP_REMOVE_CONTEXTLAYERS
} from '../reducers'


function change_basemap(payload) {
  return {
    type: MAP_CHANGE_BASEMAP,
    payload: payload
  };
}

function add_context_layer(id, payload) {
  return {
    type: MAP_ADD_CONTEXTLAYERS,
    id: id,
    payload: payload,
  };
}

function remove_context_layer(id, payload) {
  return {
    type: MAP_REMOVE_CONTEXTLAYERS,
    id: id
  };
}

export default {
  change_basemap,
  add_context_layer,
  remove_context_layer
}