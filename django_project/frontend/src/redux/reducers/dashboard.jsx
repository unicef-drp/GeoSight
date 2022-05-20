import { APIReducer } from '../reducers_api';

/**
 * DASHBOARD REQUEST reducer
 */
export const DASHBOARD_ACTION_NAME = 'DASHBOARD';
export const REFERENCE_LAYER_ACTION_NAME = 'REFERENCE_LAYER';
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
      const data = APIReducer(state, action, REFERENCE_LAYER_ACTION_NAME)
      const newState = { ...state }
      newState.data.referenceLayer = {
        ...newState.data.referenceLayer,
        ...data
      }
      return newState
    }

    // REFERENCE LAYER REDUCER
    case INDICATOR_ACTION_NAME: {
      const data = APIReducer(state, action, INDICATOR_ACTION_NAME)
      if (state.data.indicators[action.id]
        && state.data.referenceLayer.data
        && state.data.referenceLayer.data.features) {
        const geoms = [];
        state.data.referenceLayer.data.features.forEach(function (feature) {
          geoms.push(feature.properties.identifier);
        })
        data.data = data.data.filter((row) => {
          return geoms.includes(row.geometry_code);
        })
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