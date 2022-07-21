import { APIReducer } from "../../../reducers_api";

/**
 * INDICATORS_DATA reducer
 */

export const INDICATORS_DATA_ACTION_NAME = 'INDICATORS_DATA';
export const INDICATORS_DATA_ACTION_TYPE_UPDATE_LEVEL = 'INDICATORS_DATA/UPDATE_LEVEL';

const initialState = {}
export default function IndicatorsDataReducer(state = initialState, action) {
  if (action.name === INDICATORS_DATA_ACTION_NAME) {
    switch (action.type) {
      case INDICATORS_DATA_ACTION_TYPE_UPDATE_LEVEL: {
        const { id, reporting_level } = action;
        state[id].reporting_level = reporting_level
        return { ...state }
      }
      default: {
        const data = APIReducer(state, action, INDICATORS_DATA_ACTION_NAME)
        const { id } = action
        if (Object.keys(data).length !== 0) {
          data.id = id;
          const newState = {
            ...state,
          }
          newState[id] = data
          return newState
        }
      }
    }
  }
  return state
}