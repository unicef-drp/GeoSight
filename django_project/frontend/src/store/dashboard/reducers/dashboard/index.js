import { APIReducer } from '../../../reducers_api';
import indicatorReducer, { INDICATOR_ACTION_NAME } from '../indicators'

/**
 * DASHBOARD REQUEST reducer
 */
export const DASHBOARD_ACTION_NAME = 'DASHBOARD';
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
    case DASHBOARD_ACTION_NAME: {
      return APIReducer(state, action, DASHBOARD_ACTION_NAME)
    }

    /** INDICATOR REDUCER **/
    case INDICATOR_ACTION_NAME: {
      const newIndicator = indicatorReducer(state.data.indicators, action);
      if (newIndicator !== state.data.indicators) {
        const newState = { ...state }
        newState.data = {
          ...newState.data,
          indicators: newIndicator
        }
        return newState;
      }
      return state
    }
    default:
      return state
  }
}