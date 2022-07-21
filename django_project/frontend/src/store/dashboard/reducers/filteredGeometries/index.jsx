/**
 * FILTERED_GEOMETRIES_ACTION_NAME reducer
 */

export const FILTERED_GEOMETRIES_ACTION_NAME = 'FILTERED_GEOMETRIES';
export const FILTERED_GEOMETRIES_ACTION_TYPE_UPDATE = 'FILTERED_GEOMETRIES/UPDATE';

const initialState = []
export default function filteredGeometriesReducer(state = initialState, action) {
  if (action.name === FILTERED_GEOMETRIES_ACTION_NAME) {
    switch (action.type) {
      case FILTERED_GEOMETRIES_ACTION_TYPE_UPDATE: {
        return [...action.payload]
      }
    }
  }
  return state
}