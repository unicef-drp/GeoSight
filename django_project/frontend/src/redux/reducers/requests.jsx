import { APIReducer } from '../reducers_api';

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

export function dashboardRequestReducer(
  state = dashboardInitialState, action
) {
  return APIReducer(state, action, DASHBOARD_ACTION_NAME)
}

/**
 * REFERENCE_LAYER REQUEST reducer
 */
export const REFERENCE_LAYER_ACTION_NAME = 'REFERENCE_LAYER';
const referenceLayerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: {}
};

export function referenceLayerRequestReducer(
  state = referenceLayerInitialState, action
) {
  return APIReducer(state, action, REFERENCE_LAYER_ACTION_NAME)
}

/**
 * INDICATOR REQUEST reducer
 */
export const INDICATOR_ACTION_NAME = 'INDICATOR';
const indicatorInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: {}
};

export function indicatorRequestReducer(
  state = indicatorInitialState, action
) {
  return APIReducer(state, action, INDICATOR_ACTION_NAME)
}