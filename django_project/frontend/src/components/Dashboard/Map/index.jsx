/* ==========================================================================
   MAP CONTAINER
   ========================================================================== */

import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import L from 'leaflet';

import './style.scss';

/**
 * Map component
 */
export default function Map() {
  const {
    basemapLayer,
    referenceLayer,
    contextLayers
  } = useSelector(state => state.map);

  const { extent } = useSelector(state => state.dashboard.data);
  const [map, setMap] = useState(null);
  const [basemapLayerGroup, setBasemapLayerGroup] = useState(null);
  const [referenceLayerGroup, setReferenceLayerGroup] = useState(null);
  const [contextLayerGroup, setContextLayerGroup] = useState(null);

  // Pane identifier
  const basemapPane = 'basemapPane';
  const referenceLayerPane = 'referenceLayerPane';
  const contextLayerPane = 'contextLayerPane';

  useEffect(() => {
    const basemapLayerGroup = L.layerGroup([]);
    const referenceLayerGroup = L.layerGroup([]);
    const contextLayerGroup = L.layerGroup([]);
    setBasemapLayerGroup(basemapLayerGroup);
    setReferenceLayerGroup(referenceLayerGroup);
    setContextLayerGroup(contextLayerGroup);

    const map = L.map('map', {
      center: [0, 0],
      zoom: 6,
      layers: [basemapLayerGroup, contextLayerGroup, referenceLayerGroup],
      zoomControl: false
    });
    map.createPane(basemapPane);
    map.createPane(referenceLayerPane);
    map.createPane(contextLayerPane);
    setMap(map);
  }, []);

  /** EXTENT CHANGED */
  useEffect(() => {
    if (map && extent) {
      map.fitBounds([
        [extent[1], extent[0]],
        [extent[3], extent[2]]
      ])
    }
  }, [map, extent]);

  /** BASEMAP CHANGED */
  useEffect(() => {
    if (basemapLayerGroup) {
      basemapLayerGroup.eachLayer(function (layer) {
        basemapLayerGroup.removeLayer(layer);
      });
      basemapLayer.options.pane = basemapPane;
      basemapLayerGroup.addLayer(basemapLayer);
    }
  }, [basemapLayer]);

  /** CONTEXT LAYERS CHANGED */
  useEffect(() => {
    if (contextLayerGroup) {
      contextLayerGroup.eachLayer(function (layer) {
        contextLayerGroup.removeLayer(layer);
      });
      for (const [key, contextLayer] of Object.entries(contextLayers)) {
        if (contextLayer.render && contextLayer.layer) {
          const layer = contextLayer.layer;
          layer.options.pane = contextLayerPane;
          contextLayerGroup.addLayer(contextLayer.layer);
        }
      }
    }
  }, [contextLayers]);

  /** REFERENCE LAYER CHANGED */
  useEffect(() => {
    if (referenceLayerGroup) {
      referenceLayerGroup.eachLayer(function (layer) {
        referenceLayerGroup.removeLayer(layer);
      });
      referenceLayer.options.pane = referenceLayerPane;
      referenceLayerGroup.addLayer(referenceLayer);
    }
  }, [referenceLayer]);

  return <section className='dashboard__map'>
    <div id="map"></div>
  </section>
}

