import { compose, legacy_createStore as createStore } from 'redux';
import rootReducer from './reducers';

// Reducers and Actions
import Basemaps from './reducers/basemap/actions'
import ContextLayers from './reducers/contextLayers/actions'
import Dashboard from './reducers/dashboard/actions'
import FiltersData from './reducers/filtersData/actions'
import FilteredGeometries from './reducers/filteredGeometries/actions'
import Geometries from './reducers/geometries/actions'
import IndicatorsData from './reducers/indicatorsData/actions'
import Indicators from './reducers/indicators/actions'
import Map from './reducers/map/actions'
import ReferenceLayer from './reducers/referenceLayer/actions'
import ReferenceLayerData from './reducers/referenceLayerData/actions'
import Widgets from './reducers/widgets/actions'

const Actions = {
  Basemaps,
  ContextLayers,
  Dashboard,
  FilteredGeometries,
  FiltersData,
  Geometries,
  Indicators,
  IndicatorsData,
  Map,
  ReferenceLayer,
  ReferenceLayerData,
  Widgets
}

export { Actions }

const initialState = {};
const enhancers = [];

// Dev Tools
if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  ...enhancers
);

export const store = createStore(rootReducer, initialState, composedEnhancers);