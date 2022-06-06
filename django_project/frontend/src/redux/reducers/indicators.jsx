import { APIReducer } from "../reducers_api";

/**
 * INDICATOR reducer
 */

export const INDICATOR_ACTION_NAME = 'INDICATOR';
export const INDICATOR_ACTION_TYPE_ADD = 'INDICATOR/ADD';
export const INDICATOR_ACTION_TYPE_REMOVE = 'INDICATOR/REMOVE';

const initialState = []
export default function indicatorReducer(state = initialState, action) {
  switch (action.type) {
    case INDICATOR_ACTION_TYPE_ADD: {
      return [
        ...state,
        action.payload
      ]
    }
    case INDICATOR_ACTION_TYPE_REMOVE: {
      const newState = []
      state.forEach(function (indicator) {
        if (indicator.id !== action.payload.id) {
          newState.push(indicator)
        }
      })
      return newState
    }
    default:
      const data = APIReducer(state, action, INDICATOR_ACTION_NAME)
      const referenceLayer = action.referenceLayer;
      if (state[action.id]
        && !state[action.id].data
        && referenceLayer
        && referenceLayer.data
        && referenceLayer.data.features) {

        const geoms = {};
        referenceLayer?.data?.features.forEach(function (feature) {
          geoms[feature.properties.identifier] = feature.properties;
        })

        const newData = [];
        data.data.forEach(function (row) {
          if (geoms[row.geometry_code]) {
            newData.push({
              ...row,
              ...geoms[row.geometry_code]
            })
          }
        })
        data.data = newData;
        data.rawData = newData;
        const newState = [...state]
        newState[action.id] = {
          ...newState[action.id],
          ...data
        }
        return newState
      } else if (Object.keys(referenceLayer).length === 0) {
        const newState = [...state]
        newState[action.id] = {
          ...newState[action.id],
          ...data
        }
        return newState
      }
      return state
  }
}