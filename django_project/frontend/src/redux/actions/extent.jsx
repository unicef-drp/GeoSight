import {
  EXTENT_DEFAULT_ACTION_NAME,
  EXTENT_DEFAULT_ACTION_TYPE_CHANGE
} from '../reducers/dashboard'

export function changeDefault(payload) {
  return {
    name: EXTENT_DEFAULT_ACTION_NAME,
    type: EXTENT_DEFAULT_ACTION_TYPE_CHANGE,
    payload: payload
  };
}

export default {
  changeDefault
}