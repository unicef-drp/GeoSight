import { APIReducer } from '../reducers_api';

/**
 * DASHBOARD REQUEST reducer
 */
export const DASHBOARD_ACTION_NAME = 'DASHBOARD';
export const REFERENCE_LAYER_ACTION_NAME = 'REFERENCE_LAYER';
export const REFERENCE_LAYER_ACTION_TYPE_CHANGE = 'REFERENCE_LAYER/CHANGE';
export const INDICATOR_ACTION_NAME = 'INDICATOR';

const dashboardInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: {}
};

export default function dashboardReducer(
  state = dashboardInitialState, action
) {
  switch (action.name) {

    // DASHBOARD DATA
    case DASHBOARD_ACTION_NAME: {
      return APIReducer(state, action, DASHBOARD_ACTION_NAME)
    }

    // REFERENCE LAYER REDUCER
    case REFERENCE_LAYER_ACTION_NAME: {
      switch (action.type) {
        case REFERENCE_LAYER_ACTION_TYPE_CHANGE: {
          const newState = { ...state }
          newState.data = {
            ...newState.data,
            referenceLayer: action.payload
          }
          return newState
        }
        default: {
          const data = APIReducer(state, action, REFERENCE_LAYER_ACTION_NAME)
          const newState = { ...state }
          newState.data.referenceLayer = {
            ...newState.data.referenceLayer,
            ...data
          }
          return newState
        }
      }
    }

    // INDICATOR REDUCER
    case INDICATOR_ACTION_NAME: {
      const data = APIReducer(state, action, INDICATOR_ACTION_NAME)
      if (state.data.indicators[action.id]
        && state.data.referenceLayer.data
        && state.data.referenceLayer.data.features) {
        const geoms = {};
        state.data.referenceLayer.data.features.forEach(function (feature) {
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
        const newState = { ...state }
        newState.data.indicators[action.id] = {
          ...newState.data.indicators[action.id],
          ...data
        }
        return newState
      }
      return state
    }
    default:
      return state
  }
}