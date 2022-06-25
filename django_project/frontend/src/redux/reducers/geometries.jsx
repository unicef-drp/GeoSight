/**
 * INDICATOR reducer
 */

export const GEOMETRIES_CODE_ACTION_NAME = 'GEOMETRIES_CODE';
export const GEOMETRIES_CODE_ACTION_TYPE_ADD = 'GEOMETRIES_CODE/ADD';

const initialState = []
export default function geometryCodeReducer(state = initialState, action) {
  if (action.name === GEOMETRIES_CODE_ACTION_NAME) {
    switch (action.type) {
      case GEOMETRIES_CODE_ACTION_TYPE_ADD: {
        const { key, value } = action
        if (!state[key]) {
          const newState = Object.assign({}, state)
          newState[key] = value
          return newState
        }
      }
    }
  }
  return state
}