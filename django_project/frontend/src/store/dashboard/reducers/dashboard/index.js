import { APIReducer } from '../../../reducers_api';
import indicatorReducer, { INDICATOR_ACTION_NAME } from '../indicators'
import basemapsReducer, { BASEMAP_ACTION_NAME } from '../basemap'
import widgetsReducer, { WIDGET_ACTION_NAME } from "../widgets";
import extentReducer, { EXTENT_DEFAULT_ACTION_NAME } from "../extent";
import filtersReducer , { FILTERS_ACTION_NAME } from "../filters";
import referenceLayerReducer, {
  REFERENCE_LAYER_ACTION_NAME
} from '../referenceLayer'
import contextLayersReducer, {
  CONTEXT_LAYER_ACTION_NAME
} from '../contextLayers'

/**
 * DASHBOARD REQUEST reducer
 */
export const DASHBOARD_ACTION_NAME = 'DASHBOARD';
export const DASHBOARD_ACTION_TYPE_UPDATE = 'DASHBOARD/UPDATE';
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
      switch (action.type) {
        case DASHBOARD_ACTION_TYPE_UPDATE: {
          return {
            ...state,
            data: action.payload
          }
        }
        default: {
          return APIReducer(state, action, DASHBOARD_ACTION_NAME)
        }
      }
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

    /** EXTENT REDUCER **/
    case EXTENT_DEFAULT_ACTION_NAME: {
      const data = extentReducer(state.data.extent, action);
      if (data !== state.data.extent) {
        const newState = { ...state }
        newState.data = {
          ...newState.data,
          extent: data
        }
        return newState;
      }
      return state
    }

    /** FILTERS REDUCER **/
    case FILTERS_ACTION_NAME: {
      const data = filtersReducer(state.data.filters, action);
      if (data !== state.data.filters) {
        const newState = { ...state }
        newState.data = {
          ...newState.data,
          filters: data
        }
        return newState;
      }
      return state
    }

    /** BASEMAP REDUCER **/
    case BASEMAP_ACTION_NAME: {
      const data = basemapsReducer(state.data.basemapsLayers, action);
      if (data !== state.data.basemapsLayers) {
        const newState = { ...state }
        newState.data = {
          ...newState.data,
          basemapsLayers: data
        }
        return newState;
      }
      return state
    }

    /** CONTEXT LAYER REDUCER **/
    case CONTEXT_LAYER_ACTION_NAME: {
      const data = contextLayersReducer(state.data.contextLayers, action);
      if (data !== state.data.contextLayers) {
        const newState = { ...state }
        newState.data = {
          ...newState.data,
          contextLayers: data
        }
        return newState;
      }
      return state
    }
    /** REFERENCE LAYER REDUCER **/
    case REFERENCE_LAYER_ACTION_NAME: {
      const data = referenceLayerReducer(state.data.referenceLayer, action);
      if (data !== state.data.referenceLayer) {
        const newState = { ...state }
        newState.data = {
          ...newState.data,
          referenceLayer: data
        }
        return newState;
      }
      return state
    }

    // WIDGET REDUCER
    case WIDGET_ACTION_NAME: {
      const newWidgets = widgetsReducer(state.data.widgets, action);
      if (newWidgets !== state.data.widgets) {
        const newState = { ...state }
        newState.data = {
          ...newState.data,
          widgets: newWidgets
        }
        return newState;
      }
      return state
    }
    default:
      return state
  }
}