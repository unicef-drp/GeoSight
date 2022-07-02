import { queryingFromDictionary } from "../../utils/queryExtraction";

/**
 * INDICATOR reducer
 */

export const INDICATOR_DATA_ACTION_NAME = 'INDICATOR_DATA';
export const INDICATOR_DATA_ACTION_DATA_UPDATE = 'INDICATOR_DATA/UPDATE';
export const INDICATOR_DATA_ACTION_TYPE_FILTER = 'INDICATOR_DATA/FILTER';

const initialState = []
export default function indicatorDataReducer(state = initialState, action) {
  if (action.name === INDICATOR_DATA_ACTION_NAME) {
    switch (action.type) {
      case INDICATOR_DATA_ACTION_DATA_UPDATE:
        if (action.payload) {
          return [...action.payload]
        }
      // For filter
      case INDICATOR_DATA_ACTION_TYPE_FILTER: {
        const { query } = action;
        if (query) {
          let newState = [...state];
          let data = queryingFromDictionary(state, query)
          if (data) {
            let geoms = data.map((data) => {
              return data.geometry_code
            })
            newState.forEach((indicator) => {
              if (indicator.rawData) {
                indicator.data = indicator.rawData.filter(properties => {
                  return geoms.includes(properties.geometry_code);
                })
              }
            });
            return newState
          }
        }
        return state
      }
      default:
        return state
    }
  }
  return state
}