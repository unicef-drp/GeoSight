/**
 * WIDGETS reducer
 */


export const REFERENCE_LAYER_ACTION_NAME = 'REFERENCE_LAYER';
export const REFERENCE_LAYER_ACTION_TYPE_UPDATE = 'REFERENCE_LAYER/UPDATE';

const initialState = []
export default function referenceLayerReducer(state = initialState, action) {
  if (action.name === REFERENCE_LAYER_ACTION_NAME) {
    switch (action.type) {
      case REFERENCE_LAYER_ACTION_TYPE_UPDATE: {
        return action.payload
      }
    }
  }
}