/**
 * Reference Layer reducer
 */
import { APIReducer } from '../reducers_api';

export const REFERENCE_LAYER_ACTION_NAME = 'REFERENCE_LAYER';
export const REFERENCE_LAYER_ACTION_TYPE_INIT_DATA = 'REFERENCE_LAYER/INIT_DATA';
const initialState = null;

export default function referenceLayerReducer(
  state = initialState, action
) {
  if (action.name === REFERENCE_LAYER_ACTION_NAME) {
    switch (action.type) {
      case REFERENCE_LAYER_ACTION_TYPE_INIT_DATA: {
        return action.payload
      }
      default:
        return {
          ...state,
          ...APIReducer(state, action, REFERENCE_LAYER_ACTION_NAME)
        }
    }
  } else {
    return state;

  }
}