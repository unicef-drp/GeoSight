/**
 * Indicators reducer
 */
import { APIReducer } from '../reducers_api';

export const INDICATOR_ACTION_NAME = 'INDICATOR';
export const INDICATOR_ACTION_TYPE_INIT_DATA = 'INDICATOR/INIT_DATA';

const initialState = null;

export default function indicatorsReducer(
  state = initialState, action
) {
  if (action.name === INDICATOR_ACTION_NAME) {
    switch (action.type) {
      case INDICATOR_ACTION_TYPE_INIT_DATA: {
        return action.payload
      }
      default:
        const data = APIReducer(state, action, INDICATOR_ACTION_NAME)
        const newState = [...state]

        // TODO:
        //  Need to find elegant way
        //  Filter by the reference layer
        const payload = []
        if (action.referenceLayer) {
          const geoms = {};
          action.referenceLayer.features.forEach(function (feature) {
            geoms[feature.properties.identifier] = feature.properties;
          })
          data.data.forEach(function (row) {
            if (geoms[row.geometry_code]) {
              payload.push({
                ...row,
                ...geoms[row.geometry_code]
              })
            }
          })
        }
        data.data = payload
        newState[action.id] = {
          ...newState[action.id],
          ...data
        }
        return newState
    }
  } else {
    return state;

  }
}