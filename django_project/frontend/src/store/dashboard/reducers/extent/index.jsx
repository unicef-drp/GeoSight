/**
 * WIDGETS reducer
 */



export const EXTENT_DEFAULT_ACTION_NAME = 'EXTENT';
export const EXTENT_DEFAULT_ACTION_TYPE_CHANGE = 'EXTENT/CHANGE'

const initialState = []
export default function extentReducer(state = initialState, action) {
  if (action.name === EXTENT_DEFAULT_ACTION_NAME) {
    switch (action.type) {
      case EXTENT_DEFAULT_ACTION_TYPE_CHANGE: {
        return action.payload
      }
    }
  }
}