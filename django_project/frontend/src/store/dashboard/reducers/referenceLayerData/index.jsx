import { APIReducer } from "../../../reducers_api";

/**
 * REFERENCE LAYER reducer
 */
export const REFERENCE_LAYER_DATA_ACTION_NAME = 'REFERENCE_LAYER_DATA';

const initialState = {}
export default function ReferenceLayerReducer(state = initialState, action) {
  if (action.name === REFERENCE_LAYER_DATA_ACTION_NAME) {
    switch (action.type) {
      default: {
        const data = APIReducer(state, action, REFERENCE_LAYER_DATA_ACTION_NAME)
        const { id } = action
        const newState = {
          ...state,
        }
        newState[id] = data
        return newState
      }
    }
  }
  return state
}