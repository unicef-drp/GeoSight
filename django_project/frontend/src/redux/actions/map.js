import { MAP_CHANGE_BASEMAP } from '../reducers'


function change_basemap(payload) {
  return {
    type: MAP_CHANGE_BASEMAP,
    payload: payload
  };
}

export default {
  change_basemap
}