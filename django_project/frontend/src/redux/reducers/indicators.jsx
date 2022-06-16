import { APIReducer } from "../reducers_api";
import { queryingFromDictionary } from "../../utils/queryExtraction"

/**
 * INDICATOR reducer
 */

export const INDICATOR_ACTION_NAME = 'INDICATOR';
export const INDICATOR_ACTION_TYPE_ADD = 'INDICATOR/ADD';
export const INDICATOR_ACTION_TYPE_REMOVE = 'INDICATOR/REMOVE';
export const INDICATOR_ACTION_TYPE_FILTER = 'INDICATOR/FILTER';

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

    // For filter
    case INDICATOR_ACTION_TYPE_FILTER: {
      const { query } = action;
      if (query) {
        let newState = [...state];
        let data = queryingFromDictionary(state, query)
        let geoms = data.map((data) => {
          return data.geometry_code
        })
        newState.forEach((indicator) => {
          indicator.data = indicator.rawData.filter(properties => {
            return geoms.includes(properties.geometry_code);
          })
        });
        return newState
      }
      return state
    }
    default:
      const data = APIReducer(state, action, INDICATOR_ACTION_NAME)
      const referenceLayer = action.referenceLayer;

      if (state[action.id]
        && !state[action.id].data
        && Object.keys(data.data).length !== 0
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