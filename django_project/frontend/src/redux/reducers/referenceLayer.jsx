import { APIReducer } from '../reducers_api';

/**
 * Reference Layer reducer
 */
export const REFERENCE_LAYER_ACTION_NAME = `REFERENCE_LAYER`;
const referenceLayerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: {}
};

export default function referenceLayerReducer(state = referenceLayerInitialState, action) {
  return APIReducer(state, action, REFERENCE_LAYER_ACTION_NAME);
}