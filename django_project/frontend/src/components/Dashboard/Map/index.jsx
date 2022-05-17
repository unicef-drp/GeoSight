/* ==========================================================================
   MAP CONTAINER
   ========================================================================== */

import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import L from 'leaflet';

import './style.scss';
import ReferenceLayer from "./ReferenceLayer";

/**
 * Map component
 */
export default function Map() {
  const {
    contextLayers,
    basemapLayer,
    referenceLayer
  } = useSelector(state => state.map);
  const [map, setMap] = useState(null);
  const [basemapLayerGroup, setBasemapLayerGroup] = useState(null);
  const [referenceLayerGroup, setReferenceLayerGroup] = useState(null);
  const [contextLayerGroup, setContextLayerGroup] = useState(null);

  useEffect(() => {
    const basemapLayerGroup = L.layerGroup([]);
    const referenceLayerGroup = L.layerGroup([]);
    const contextLayerGroup = L.layerGroup([]);
    setBasemapLayerGroup(basemapLayerGroup);
    setReferenceLayerGroup(referenceLayerGroup);
    setContextLayerGroup(contextLayerGroup);

    const map = L.map('map', {
      center: [5.6544108, 46.5339302],
      zoom: 6,
      layers: [basemapLayerGroup, referenceLayerGroup, contextLayerGroup],
      zoomControl: false
    });
    setMap(map);
  }, []);

  /** BASEMAP CHANGED */
  useEffect(() => {
    if (basemapLayerGroup) {
      basemapLayerGroup.eachLayer(function (layer) {
        basemapLayerGroup.removeLayer(layer);
      });
      basemapLayerGroup.addLayer(basemapLayer);
    }
  }, [basemapLayer]);

  /** CONTEXT LAYERS CHANGED */
  useEffect(() => {
    if (contextLayerGroup) {
      contextLayerGroup.eachLayer(function (layer) {
        contextLayerGroup.removeLayer(layer);
      });
      for (const [key, layer] of Object.entries(contextLayers)) {
        contextLayerGroup.addLayer(layer);
      }
    }
  }, [contextLayers]);

  /** REFERENCE LAYER CHANGED */
  useEffect(() => {
    if (referenceLayerGroup) {
      referenceLayerGroup.eachLayer(function (layer) {
        referenceLayerGroup.removeLayer(layer);
      });
      referenceLayerGroup.addLayer(referenceLayer);
    }
  }, [referenceLayer]);

  return <section className='dashboard__map'>
    <div id="map"></div>
    <ReferenceLayer/>
  </section>
}

